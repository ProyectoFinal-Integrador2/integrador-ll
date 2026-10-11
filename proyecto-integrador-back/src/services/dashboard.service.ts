import {
  ticketRepositorio,
  type TicketRepositorio,
} from '../repositories/ticket.repository';
import {
  evaluacionRepositorio,
  type EvaluacionRepositorio,
} from '../repositories/evaluation.repository';
import {
  disponibilidadRepositorio,
  type DisponibilidadRepositorio,
} from '../repositories/availability.repository';
import {
  slaRepositorio,
  type SlaRepositorio,
} from '../repositories/sla.repository';
import { usuarioRepositorio, type UsuarioRepositorio } from '../repositories/user.repository';
import { ordenarSlaPorUrgencia } from './sla.service';
import { HttpError } from '../utils/httpError';
import type { Evaluacion } from '../types/evaluation.types';
import type { Ticket } from '../types/ticket.types';
import { ESTADOS_ACTIVOS } from '../types/ticket.types';
import {
  ETIQUETAS_SEMANA,
  type DiaDashboard,
  type ReporteDashboard,
  type ReporteDashboardJefe,
  type ReporteDashboardTecnico,
  type ReporteDashboardUsuario,
  type SatisfaccionDashboard,
  type TicketsDashboard,
} from '../types/dashboard.types';

/** Cuantos tickets lista la tabla de "recientes". */
const LIMITE_RECIENTES = 6;

/** Cuantas evaluaciones se muestran en la vista del tecnico. */
const LIMITE_EVALUACIONES = 5;

export class DashboardServicio {
  constructor(
    private readonly tickets: TicketRepositorio = ticketRepositorio,
    private readonly evaluaciones: EvaluacionRepositorio = evaluacionRepositorio,
    private readonly tecnicos: DisponibilidadRepositorio = disponibilidadRepositorio,
    private readonly sla: SlaRepositorio = slaRepositorio,
    private readonly usuarios: UsuarioRepositorio = usuarioRepositorio,
  ) {}

  /**
   * Reune en una sola respuesta lo que el dashboard muestra, para que la
   * pantalla no dispare cinco requests en paralelo ni duplique la agregacion
   * en el navegador.
   *
   * El alcance se decide por lo que llega: sin ids devuelve la vista global del
   * Jefe TI, con `tecnicoId` la del tecnico y con `usuarioId` la del solicitante.
   *
   * Ojo: hoy los ids llegan por query string porque no hay autenticacion, asi
   * que son filtros y no autorizaciones.
   */
  async resumen(tecnicoId?: string, usuarioId?: string): Promise<ReporteDashboard> {
    if (tecnicoId) return this.construirReporteTecnico(tecnicoId);
    if (usuarioId) return this.construirReporteUsuario(usuarioId);
    return this.construirReporteJefe();
  }

  private async construirReporteJefe(): Promise<ReporteDashboardJefe> {
    const [todosLosTickets, todasLasEvaluaciones, todosLosTecnicos, todosLosSla] =
      await Promise.all([
        this.tickets.listar(),
        this.evaluaciones.listar(),
        this.tecnicos.listar(),
        this.sla.listar(),
      ]);

    return {
      alcance: 'jefe',
      tickets: this.construirTickets(todosLosTickets),
      satisfaccion: this.construirSatisfaccion(todasLasEvaluaciones),
      tecnicos: todosLosTecnicos,
      sla: ordenarSlaPorUrgencia(todosLosSla),
      generadoEn: new Date().toISOString(),
    };
  }

  private async construirReporteTecnico(
    tecnicoId: string,
  ): Promise<ReporteDashboardTecnico> {
    const [todosLosTecnicos, todasLasEvaluaciones, todosLosTickets, todosLosSla] =
      await Promise.all([
        this.tecnicos.listar(),
        this.evaluaciones.listar(),
        this.tickets.listar(),
        this.sla.listar(),
      ]);

    // La disponibilidad solo lista tecnicos activos: si el id no aparece, no es
    // un tecnico en condiciones de tener tablero.
    const tecnico = todosLosTecnicos.find(
      (candidato) => candidato.id === tecnicoId,
    );

    if (!tecnico) {
      throw new HttpError(404, 'Tecnico no encontrado o inactivo');
    }

    // El repositorio ya las devuelve de mas reciente a mas antigua.
    const evaluaciones = todasLasEvaluaciones
      .filter((evaluacion) => evaluacion.idTecnico === tecnicoId)
      .slice(0, LIMITE_EVALUACIONES);

    /**
     * Solo `Abierto` y `En progreso`: un ticket cerrado o cancelado ya no esta
     * pidiendo trabajo, asi que listarlos como pendientes mandaria al tecnico a
     * algo que ya termino.
     */
    const ticketsPendientes = this.ordenarPorCreadoDesc(todosLosTickets)
      .filter((ticket) => ESTADOS_ACTIVOS.includes(ticket.estado))
      .slice(0, LIMITE_RECIENTES);

    return {
      alcance: 'tecnico',
      tecnico,
      evaluaciones,
      satisfaccion: this.construirSatisfaccion(evaluaciones),
      ticketsPendientes,
      sla: ordenarSlaPorUrgencia(todosLosSla),
      generadoEn: new Date().toISOString(),
    };
  }

  private async construirReporteUsuario(
    usuarioId: string,
  ): Promise<ReporteDashboardUsuario> {
    const [todosLosTickets, todasLasEvaluaciones, todosLosSla, todosLosUsuarios] =
      await Promise.all([
        this.tickets.listar(),
        this.evaluaciones.listar(),
        this.sla.listar(),
        this.usuarios.listar(),
      ]);

    const usuario = todosLosUsuarios.find((candidato) => candidato.id === usuarioId);

    if (!usuario) {
      throw new HttpError(404, 'Usuario no encontrado');
    }

    const propiosTickets = todosLosTickets.filter(
      (ticket) => ticket.usuarioId === usuarioId,
    );

    const propiasEvaluaciones = todasLasEvaluaciones.filter(
      (evaluacion) => evaluacion.idEvaluador === usuarioId,
    );

    // Los pendientes son los cerrados que todavia no tienen conformidad suya.
    const idsEvaluados = new Set(
      propiasEvaluaciones.map((evaluacion) => evaluacion.idTicket),
    );

    const evaluacionesPendientes = this.ordenarPorCreadoDesc(propiosTickets).filter(
      (ticket) => ticket.estado === 'Cerrado' && !idsEvaluados.has(ticket.id),
    );

    return {
      alcance: 'usuario',
      tickets: this.construirTickets(propiosTickets),
      evaluacionesPendientes,
      evaluaciones: propiasEvaluaciones,
      sla: ordenarSlaPorUrgencia(todosLosSla),
      generadoEn: new Date().toISOString(),
    };
  }

  private construirTickets(tickets: Ticket[]): TicketsDashboard {
    const total = tickets.length;

    return {
      abiertos: tickets.filter((ticket) => ticket.estado === 'Abierto').length,
      enProgreso: tickets.filter((ticket) => ticket.estado === 'En progreso')
        .length,
      cerrados: tickets.filter((ticket) => ticket.estado === 'Cerrado').length,
      cancelados: tickets.filter((ticket) => ticket.estado === 'Cancelado').length,
      total,
      recientes: this.ordenarPorCreadoDesc(tickets).slice(0, LIMITE_RECIENTES),
      semana: this.construirSemana(tickets),
    };
  }

  private construirSatisfaccion(
    evaluaciones: Evaluacion[],
  ): SatisfaccionDashboard {
    const total = evaluaciones.length;

    const sumaPuntuacion = evaluaciones.reduce(
      (acc, evaluacion) => acc + evaluacion.puntuacion,
      0,
    );

    return {
      total,
      promedioPuntuacion:
        total === 0 ? null : Math.round((sumaPuntuacion / total) * 100) / 100,
    };
  }

  /** Mas recientes primero; `id` desempata porque dos tickets pueden compartir
      `creadoEn` y el orden no tiene que depender del azar. */
  private ordenarPorCreadoDesc(tickets: Ticket[]): Ticket[] {
    return [...tickets].sort(
      (a, b) =>
        b.creadoEn.localeCompare(a.creadoEn) || Number(b.id) - Number(a.id),
    );
  }

  /**
   * Cuenta los tickets creados en cada dia de la semana en curso.
   *
   * Los limites se calculan con la hora local del servidor, que es la misma
   * que usaria el usuario: comparar contra un "lunes UTC" correria a alguien
   * que abre el dashboard un domingo por la tarde.
   */
  private construirSemana(tickets: Ticket[]): DiaDashboard[] {
    const ahora = new Date();

    // `getDay()` da 0 para domingo; el lunes tiene que ser el indice 0.
    const desplazamientoDesdeLunes = (ahora.getDay() + 6) % 7;

    const lunes = new Date(ahora);
    lunes.setHours(0, 0, 0, 0);
    lunes.setDate(lunes.getDate() - desplazamientoDesdeLunes);

    return ETIQUETAS_SEMANA.map((etiqueta, indice) => {
      const inicioDia = new Date(lunes);
      inicioDia.setDate(lunes.getDate() + indice);

      // El dia siguiente como tope exclusive: asi un ticket creado exactamente
      // a medianoche cae en el dia correcto y no en los dos.
      const finDia = new Date(inicioDia);
      finDia.setDate(inicioDia.getDate() + 1);

      const conteo = tickets.filter((ticket) => {
        const creadoEn = new Date(ticket.creadoEn);
        return creadoEn >= inicioDia && creadoEn < finDia;
      }).length;

      return { etiqueta, conteo };
    });
  }
}

export const dashboardServicio = new DashboardServicio();