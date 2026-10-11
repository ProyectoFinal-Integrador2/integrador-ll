import {
  ticketRepositorio,
  type TicketRepositorio,
} from '../repositories/ticket.repository';
import {
  evaluacionRepositorio,
  type EvaluacionRepositorio,
} from '../repositories/evaluation.repository';
import { ESTADOS_TICKET, PRIORIDADES_TICKET, type Ticket } from '../types/ticket.types';
import { PUNTUACIONES_EVALUACION, type Evaluacion } from '../types/evaluation.types';
import type {
  RebanadaReporte,
  ReporteEvaluaciones,
  ReporteServicio,
  ReporteTickets,
} from '../types/report.types';

/**
 * Reparte el 100% entre las rebanadas sin que la suma se pase ni quede corta.
 *
 * Redondear cada parte por separado no alcanza: con 3 de 7 tickets el 43% y el
 * 29% y el 29% suman 101, y un reporte que muestra 101% esta mal aunque cada
 * numero por separado sea correcto. Se reparte la parte entera de cada una y el
 * 1% que sobra va a las que mas pierden al truncar (mayor parte decimal).
 */
const aPorcentajes = (conteos: number[], total: number): number[] => {
  if (total === 0) return conteos.map(() => 0);

  const exactos = conteos.map((conteo) => (conteo / total) * 100);
  const resultado = exactos.map(Math.floor);

  let sobrante = 100 - resultado.reduce((acc, valor) => acc + valor, 0);

  const porDecimalPerdido = exactos
    .map((valor, indice) => ({ indice, perdido: valor - Math.floor(valor) }))
    .sort((a, b) => b.perdido - a.perdido);

  for (const { indice } of porDecimalPerdido) {
    if (sobrante <= 0) break;
    resultado[indice] += 1;
    sobrante -= 1;
  }

  return resultado;
};

/**
 * Cuenta y arma las rebanadas en el orden del catalogo del dominio, no en el
 * orden de aparicion: "Critico" tiene que salir primero siempre, y las
 * categorias con cero igual se listan para que se vea que existen.
 */
const aRebanadas = <T extends string>(
  items: readonly T[],
  contarDe: (item: T) => number,
  total: number,
): RebanadaReporte[] => {
  const conteos = items.map(contarDe);

  return items.map((etiqueta, indice) => ({
    etiqueta,
    conteo: conteos[indice],
    porcentaje: aPorcentajes(conteos, total)[indice],
  }));
};

export class ServicioDeReportes {
  constructor(
    private readonly tickets: TicketRepositorio = ticketRepositorio,
    private readonly evaluaciones: EvaluacionRepositorio = evaluacionRepositorio,
  ) {}

  /**
   * Agrega en el servidor y no en el navegador: asi el frontend recibe el
   * reporte listo y no las tablas completas para contar.
   */
  async resumen(): Promise<ReporteServicio> {
    const [todosLosTickets, todasLasEvaluaciones] = await Promise.all([
      this.tickets.listar(),
      this.evaluaciones.listar(),
    ]);

    return {
      tickets: this.construirReporteTickets(todosLosTickets),
      evaluaciones: this.construirReporteEvaluaciones(todasLasEvaluaciones),
      generadoEn: new Date().toISOString(),
    };
  }

  private construirReporteTickets(tickets: Ticket[]): ReporteTickets {
    const total = tickets.length;
    const cerrados = tickets.filter((ticket) => ticket.estado === 'Cerrado').length;
    const cancelados = tickets.filter((ticket) => ticket.estado === 'Cancelado').length;

    return {
      total,
      cerrados,
      /**
       * Un ticket cancelado esta terminado: no se esta trabajando en el. Por eso
       * se resta tambien, y no como `total - cerrados`, que lo contaria como
       * abierto y haria que "abiertos" no cuadre con la barra por estado.
       */
      abiertos: total - cerrados - cancelados,
      porEstado: aRebanadas(
        ESTADOS_TICKET,
        (estado) =>
          tickets.filter((ticket) => ticket.estado === estado).length,
        total,
      ),
      porPrioridad: aRebanadas(
        PRIORIDADES_TICKET,
        (prioridad) =>
          tickets.filter((ticket) => ticket.prioridad === prioridad).length,
        total,
      ),
    };
  }

  private construirReporteEvaluaciones(
    evaluaciones: Evaluacion[],
  ): ReporteEvaluaciones {
    const total = evaluaciones.length;

    const sumaPuntuacion = evaluaciones.reduce(
      (acc, evaluacion) => acc + evaluacion.puntuacion,
      0,
    );

    // De 5 a 1 estrellas: el reporte se lee de mejor a peor calificacion.
    const porPuntuacion = aRebanadas(
      [...PUNTUACIONES_EVALUACION].reverse().map(String),
      (etiqueta) =>
        evaluaciones.filter(
          (evaluacion) => String(evaluacion.puntuacion) === etiqueta,
        ).length,
      total,
    );

    return {
      total,
      promedioPuntuacion:
        total === 0 ? null : Math.round((sumaPuntuacion / total) * 100) / 100,
      porPuntuacion,
    };
  }
}

export const servicioDeReportes = new ServicioDeReportes();