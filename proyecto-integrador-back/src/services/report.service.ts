import {
  equipoRepositorio,
  type EquipoRepositorio,
} from '../repositories/equipment.repository';
import {
  evaluacionRepositorio,
  type EvaluacionRepositorio,
} from '../repositories/evaluation.repository';
import {
  conocimientoRepositorio,
  type ConocimientoRepositorio,
} from '../repositories/knowledge.repository';
import {
  slaRepositorio,
  type SlaRepositorio,
} from '../repositories/sla.repository';
import {
  ticketRepositorio,
  type TicketRepositorio,
} from '../repositories/ticket.repository';
import {
  usuarioRepositorio,
  type UsuarioRepositorio,
} from '../repositories/user.repository';
import {
  ESTADOS_ACTIVOS,
  ESTADOS_TICKET,
  PRIORIDADES_TICKET,
  type Ticket,
} from '../types/ticket.types';
import {
  PUNTUACIONES_EVALUACION,
  type Evaluacion,
} from '../types/evaluation.types';
import { NIVELES_SLA, type NivelSla, type SlaPrioridad } from '../types/sla.types';
import type {
  CargaTecnico,
  FallaEquipo,
  RebanadaReporte,
  ReporteCarga,
  ReporteConocimiento,
  ReporteEvaluaciones,
  ReporteFallasEquipo,
  ReporteSatisfaccion,
  ReporteServicio,
  ReporteSla,
  ReporteSlaPrioridad,
  ReporteTickets,
  SatisfaccionTecnico,
  TicketSlaIncumplido,
} from '../types/report.types';

/** Cuantos incumplimientos se listan en HU20; el conteo global no se limita. */
const LIMITE_INCUMPLIDOS = 20;

/** Cuantos articulos devuelve el ranking de HU24. */
const LIMITE_CONOCIMIENTO = 10;

const redondear = (valor: number, decimales = 1): number => {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
};

const promedio = (valores: number[]): number | null =>
  valores.length === 0
    ? null
    : redondear(valores.reduce((acc, valor) => acc + valor, 0) / valores.length);

const minutosEntre = (inicio: string, fin: string): number =>
  redondear(
    Math.max(0, new Date(fin).getTime() - new Date(inicio).getTime()) / 60000,
  );

const porcentaje = (parte: number, total: number): number | null =>
  total === 0 ? null : Math.round((parte / total) * 100);

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
    private readonly equipos: EquipoRepositorio = equipoRepositorio,
    private readonly conocimiento: ConocimientoRepositorio = conocimientoRepositorio,
    private readonly sla: SlaRepositorio = slaRepositorio,
    private readonly usuarios: UsuarioRepositorio = usuarioRepositorio,
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

  /**
   * HU20. Solo se pueden medir los tickets cerrados que tengan SLA y las dos
   * marcas de tiempo. Los historicos sin marcas se informan como "sin datos"
   * en lugar de asumir que cumplieron.
   */
  async cumplimientoSla(): Promise<ReporteSla> {
    const [todosLosTickets, prioridades] = await Promise.all([
      this.tickets.listar(),
      this.sla.listar(),
    ]);

    const mapaSla = this.construirMapaSla(prioridades);
    const cerrados = todosLosTickets.filter((ticket) => ticket.estado === 'Cerrado');
    const cancelados = todosLosTickets.filter(
      (ticket) => ticket.estado === 'Cancelado',
    ).length;
    const enCurso = todosLosTickets.filter((ticket) =>
      ESTADOS_ACTIVOS.includes(ticket.estado),
    ).length;
    const sinSla = todosLosTickets.filter(
      (ticket) => !mapaSla.has(ticket.prioridad),
    ).length;
    const sinDatos = cerrados.filter(
      (ticket) =>
        mapaSla.has(ticket.prioridad) &&
        (ticket.iniciadoEn === null || ticket.cerradoEn === null),
    ).length;

    const incumplidos: TicketSlaIncumplido[] = [];

    const porPrioridad: ReporteSlaPrioridad[] = NIVELES_SLA.map((nivel) => {
      const sla = mapaSla.get(nivel);
      const ticketsNivel = cerrados.filter((ticket) => ticket.prioridad === nivel);

      const evaluados = ticketsNivel.flatMap((ticket) => {
        if (!sla) return [];
        const evaluacion = this.evaluarSla(ticket, sla);
        if (!evaluacion) return [];

        if (!evaluacion.cumple) incumplidos.push(evaluacion.detalle);
        return [evaluacion];
      });

      const cumplen = evaluados.filter((evaluacion) => evaluacion.cumple).length;

      return {
        nivel,
        tickets: ticketsNivel.length,
        evaluables: evaluados.length,
        cumplen,
        porcentajeCumplimiento: porcentaje(cumplen, evaluados.length),
        promedioRespuestaMin: promedio(
          evaluados.map((evaluacion) => evaluacion.minutosRespuesta),
        ),
        promedioResolucionMin: promedio(
          evaluados.map((evaluacion) => evaluacion.minutosResolucion),
        ),
      };
    });

    const evaluables = porPrioridad.reduce(
      (acc, prioridad) => acc + prioridad.evaluables,
      0,
    );
    const cumplen = porPrioridad.reduce(
      (acc, prioridad) => acc + prioridad.cumplen,
      0,
    );

    incumplidos.sort(
      (a, b) =>
        b.excesoRespuestaMin +
        b.excesoResolucionMin -
        (a.excesoRespuestaMin + a.excesoResolucionMin),
    );

    return {
      totalTickets: todosLosTickets.length,
      cerrados: cerrados.length,
      cancelados,
      enCurso,
      evaluables,
      cumplen,
      porcentajeCumplimiento: porcentaje(cumplen, evaluables),
      sinSla,
      sinDatos,
      porPrioridad,
      incumplidos: incumplidos.slice(0, LIMITE_INCUMPLIDOS),
      generadoEn: new Date().toISOString(),
    };
  }

  /** HU21. Carga actual e historica por tecnico. */
  async cargaTecnicos(): Promise<ReporteCarga> {
    const [todosLosTickets, usuarios] = await Promise.all([
      this.tickets.listar(),
      this.usuarios.listar(),
    ]);

    const tecnicosActivos = usuarios.filter(
      (usuario) => usuario.rol === 'Técnico' && usuario.estado === 'Activo',
    );

    const ids = new Set(tecnicosActivos.map((tecnico) => tecnico.id));

    for (const ticket of todosLosTickets) {
      if (ticket.tecnicoId) ids.add(ticket.tecnicoId);
    }

    const nombres = new Map(
      usuarios.map((usuario) => [usuario.id, usuario.nombre]),
    );

    const tecnicos: CargaTecnico[] = [...ids]
      .map((id) => {
        const propios = todosLosTickets.filter(
          (ticket) => ticket.tecnicoId === id,
        );
        const cerrados = propios.filter((ticket) => ticket.estado === 'Cerrado');

        const tiemposResolucion = cerrados.flatMap((ticket) =>
          ticket.cerradoEn
            ? [minutosEntre(ticket.creadoEn, ticket.cerradoEn)]
            : [],
        );

        return {
          id,
          nombre: nombres.get(id) ?? `Tecnico ${id}`,
          activos: propios.filter((ticket) => ticket.estado === 'En progreso')
            .length,
          cerrados: cerrados.length,
          cancelados: propios.filter((ticket) => ticket.estado === 'Cancelado')
            .length,
          asignados: propios.length,
          promedioResolucionMin: promedio(tiemposResolucion),
        };
      })
      .sort(
        (a, b) =>
          b.activos - a.activos ||
          b.asignados - a.asignados ||
          a.nombre.localeCompare(b.nombre),
      );

    return {
      tecnicos,
      sinAsignar: todosLosTickets.filter(
        (ticket) => !ticket.tecnicoId && ESTADOS_ACTIVOS.includes(ticket.estado),
      ).length,
      totalTickets: todosLosTickets.length,
      generadoEn: new Date().toISOString(),
    };
  }

  /** HU22. Agrupa las incidencias por equipo para detectar los problematicos. */
  async fallasPorEquipo(): Promise<ReporteFallasEquipo> {
    const [todosLosTickets, equipos] = await Promise.all([
      this.tickets.listar(),
      this.equipos.listar(),
    ]);

    const equiposReporte: FallaEquipo[] = equipos
      .map((equipo) => {
        const propios = todosLosTickets.filter(
          (ticket) => ticket.equipoId === equipo.id,
        );
        const total = propios.length;

        return {
          id: equipo.id,
          codigo: equipo.codigo,
          nombre: equipo.nombre,
          area: equipo.area,
          estado: equipo.estado,
          tickets: total,
          abiertos: propios.filter((ticket) =>
            ESTADOS_ACTIVOS.includes(ticket.estado),
          ).length,
          cerrados: propios.filter((ticket) => ticket.estado === 'Cerrado').length,
          porPrioridad: aRebanadas(
            PRIORIDADES_TICKET,
            (prioridad) =>
              propios.filter((ticket) => ticket.prioridad === prioridad).length,
            total,
          ),
          ultimaFallaEn:
            propios.length === 0
              ? null
              : propios.reduce(
                  (masReciente, ticket) =>
                    ticket.creadoEn > masReciente ? ticket.creadoEn : masReciente,
                  propios[0].creadoEn,
                ),
        };
      })
      .sort(
        (a, b) =>
          b.tickets - a.tickets ||
          (b.ultimaFallaEn ?? '').localeCompare(a.ultimaFallaEn ?? '') ||
          a.codigo.localeCompare(b.codigo),
      );

    return {
      equipos: equiposReporte,
      ticketsSinEquipo: todosLosTickets.filter((ticket) => !ticket.equipoId)
        .length,
      totalTickets: todosLosTickets.length,
      generadoEn: new Date().toISOString(),
    };
  }

  /** HU23. Satisfaccion global y desglose por tecnico. */
  async satisfaccion(): Promise<ReporteSatisfaccion> {
    const [todasLasEvaluaciones, usuarios] = await Promise.all([
      this.evaluaciones.listar(),
      this.usuarios.listar(),
    ]);

    const porTecnico: SatisfaccionTecnico[] = usuarios
      .filter((usuario) => usuario.rol === 'Técnico')
      .map((tecnico) => {
        const propias = todasLasEvaluaciones.filter(
          (evaluacion) => evaluacion.idTecnico === tecnico.id,
        );

        return {
          id: tecnico.id,
          nombre: tecnico.nombre,
          total: propias.length,
          promedioPuntuacion: this.promedioPuntuacion(propias),
          porPuntuacion: this.distribucionPuntuacion(propias),
        };
      })
      .sort(
        (a, b) =>
          b.total - a.total ||
          (b.promedioPuntuacion ?? -1) - (a.promedioPuntuacion ?? -1) ||
          a.nombre.localeCompare(b.nombre),
      );

    return {
      ...this.construirReporteEvaluaciones(todasLasEvaluaciones),
      porTecnico,
      generadoEn: new Date().toISOString(),
    };
  }

  /** HU24. Ranking de articulos por vistas. */
  async conocimientoMasConsultado(): Promise<ReporteConocimiento> {
    const [articulos, totalVistas] = await Promise.all([
      this.conocimiento.listarMasConsultados(LIMITE_CONOCIMIENTO),
      this.conocimiento.contarVistas(),
    ]);

    return {
      totalVistas,
      articulos: articulos.map((articulo) => ({
        ...articulo,
        porcentajeVistas:
          totalVistas === 0
            ? 0
            : Math.round((articulo.vistas / totalVistas) * 100),
      })),
      generadoEn: new Date().toISOString(),
    };
  }

  /**
   * Cuando hay mas de un SLA para el mismo nivel, el ticket se mide contra el
   * compromiso vigente: el de `actualizado_en` mas reciente.
   */
  private construirMapaSla(slas: SlaPrioridad[]): Map<NivelSla, SlaPrioridad> {
    const mapa = new Map<NivelSla, SlaPrioridad>();

    for (const sla of slas) {
      const actual = mapa.get(sla.nivel);

      const esMasReciente =
        !actual ||
        sla.actualizadoEn > actual.actualizadoEn ||
        (sla.actualizadoEn === actual.actualizadoEn &&
          Number(sla.id) > Number(actual.id));

      if (esMasReciente) mapa.set(sla.nivel, sla);
    }

    return mapa;
  }

  private evaluarSla(
    ticket: Ticket,
    sla: SlaPrioridad,
  ): {
    cumple: boolean;
    minutosRespuesta: number;
    minutosResolucion: number;
    detalle: TicketSlaIncumplido;
  } | null {
    if (!ticket.iniciadoEn || !ticket.cerradoEn) return null;

    const minutosRespuesta = minutosEntre(ticket.creadoEn, ticket.iniciadoEn);
    const minutosResolucion = minutosEntre(ticket.creadoEn, ticket.cerradoEn);
    const incumpleRespuesta = minutosRespuesta > sla.minutosRespuesta;
    const incumpleResolucion = minutosResolucion > sla.minutosResolucion;

    return {
      cumple: !incumpleRespuesta && !incumpleResolucion,
      minutosRespuesta,
      minutosResolucion,
      detalle: {
        id: ticket.id,
        prioridad: ticket.prioridad,
        tecnicoNombre: ticket.tecnicoNombre,
        creadoEn: ticket.creadoEn,
        iniciadoEn: ticket.iniciadoEn,
        cerradoEn: ticket.cerradoEn,
        minutosRespuesta,
        minutosResolucion,
        slaRespuestaMin: sla.minutosRespuesta,
        slaResolucionMin: sla.minutosResolucion,
        excesoRespuestaMin: Math.max(
          0,
          redondear(minutosRespuesta - sla.minutosRespuesta),
        ),
        excesoResolucionMin: Math.max(
          0,
          redondear(minutosResolucion - sla.minutosResolucion),
        ),
      },
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
        (estado) => tickets.filter((ticket) => ticket.estado === estado).length,
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
    return {
      total: evaluaciones.length,
      promedioPuntuacion: this.promedioPuntuacion(evaluaciones),
      porPuntuacion: this.distribucionPuntuacion(evaluaciones),
    };
  }

  private promedioPuntuacion(evaluaciones: Evaluacion[]): number | null {
    if (evaluaciones.length === 0) return null;

    const sumaPuntuacion = evaluaciones.reduce(
      (acc, evaluacion) => acc + evaluacion.puntuacion,
      0,
    );

    return Math.round((sumaPuntuacion / evaluaciones.length) * 100) / 100;
  }

  private distribucionPuntuacion(
    evaluaciones: Evaluacion[],
  ): RebanadaReporte[] {
    // De 5 a 1 estrellas: el reporte se lee de mejor a peor calificacion.
    return aRebanadas(
      [...PUNTUACIONES_EVALUACION].reverse().map(String),
      (etiqueta) =>
        evaluaciones.filter(
          (evaluacion) => String(evaluacion.puntuacion) === etiqueta,
        ).length,
      evaluaciones.length,
    );
  }
}

export const servicioDeReportes = new ServicioDeReportes();
