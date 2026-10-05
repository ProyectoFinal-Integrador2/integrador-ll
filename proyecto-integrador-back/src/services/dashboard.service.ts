import {
  ticketRepository,
  type TicketRepository,
} from '../repositories/ticket.repository';
import {
  evaluationRepository,
  type EvaluationRepository,
} from '../repositories/evaluation.repository';
import {
  availabilityRepository,
  type AvailabilityRepository,
} from '../repositories/availability.repository';
import {
  slaRepository,
  type SlaRepository,
} from '../repositories/sla.repository';
import { userRepository, type UserRepository } from '../repositories/user.repository';
import { sortSlaByUrgency } from './sla.service';
import { HttpError } from '../utils/httpError';
import type { ServiceEvaluation } from '../types/evaluation.types';
import type { Ticket } from '../types/ticket.types';
import { ACTIVE_TICKET_STATUSES } from '../types/ticket.types';
import {
  WEEKDAY_LABELS,
  type DashboardReport,
  type DashboardSatisfaction,
  type DashboardTickets,
  type DashboardWeekDay,
  type JefeDashboardReport,
  type TecnicoDashboardReport,
  type UsuarioDashboardReport,
} from '../types/dashboard.types';

/** Cuantos tickets lists la tabla de "recientes". */
const RECENT_LIMIT = 6;

/** Cuantas evaluaciones se muestran en la vista del tecnico. */
const EVALUATION_LIMIT = 5;

export class DashboardService {
  constructor(
    private readonly tickets: TicketRepository = ticketRepository,
    private readonly evaluations: EvaluationRepository = evaluationRepository,
    private readonly technicians: AvailabilityRepository = availabilityRepository,
    private readonly sla: SlaRepository = slaRepository,
    private readonly users: UserRepository = userRepository,
  ) {}

  /**
   * Reune en una sola respuesta lo que el dashboard muestra, para que la
   * pantalla no dispare cinco requests en paralelo ni duplique la agregacion
   * en el navegador.
   *
   * El alcance se decide por lo que llega: sin ids devuelve la vista global del
   * Jefe TI, con `technicianId` la del tecnico y con `userId` la del solicitante.
   *
   * Ojo: hoy los ids llegan por query string porque no hay autenticacion, asi
   * que son filtros y no autorizaciones. Cuando exista auth real, tienen que
   * salir de la sesion validada en el servidor y dejar de venir del cliente.
   */
  async summary(technicianId?: string, userId?: string): Promise<DashboardReport> {
    if (technicianId) return this.buildTecnicoReport(technicianId);
    if (userId) return this.buildUsuarioReport(userId);
    return this.buildJefeReport();
  }

  private async buildJefeReport(): Promise<JefeDashboardReport> {
    const [allTickets, allEvaluations, allTechnicians, allSla] =
      await Promise.all([
        this.tickets.findAll(),
        this.evaluations.findAll(),
        this.technicians.findAll(),
        this.sla.findAll(),
      ]);

    return {
      scope: 'jefe',
      tickets: this.buildTickets(allTickets),
      satisfaction: this.buildSatisfaction(allEvaluations),
      technicians: allTechnicians,
      sla: sortSlaByUrgency(allSla),
      generatedAt: new Date().toISOString(),
    };
  }

  private async buildTecnicoReport(
    technicianId: string,
  ): Promise<TecnicoDashboardReport> {
    const [allTechnicians, allEvaluations, allTickets, allSla] =
      await Promise.all([
        this.technicians.findAll(),
        this.evaluations.findAll(),
        this.tickets.findAll(),
        this.sla.findAll(),
      ]);

    // La disponibilidad solo lista tecnicos activos: si el id no aparece, no es
    // un tecnico en condiciones de tener tablero.
    const technician = allTechnicians.find(
      (candidate) => candidate.id === technicianId,
    );

    if (!technician) {
      throw new HttpError(404, 'Tecnico no encontrado o inactivo');
    }

    // El repositorio ya las devuelve de mas reciente a mas antigua.
    const evaluations = allEvaluations
      .filter((evaluation) => evaluation.technicianId === technicianId)
      .slice(0, EVALUATION_LIMIT);

    /**
     * Solo `Abierto` y `En progreso`: un ticket cerrado o cancelado ya no esta
     * pidiendo trabajo, asi que listarlos como pendientes mandaria al tecnico a
     * algo que ya termino.
     */
    const pendingTickets = this.sortByCreatedAtDesc(allTickets)
      .filter((ticket) => ACTIVE_TICKET_STATUSES.includes(ticket.status))
      .slice(0, RECENT_LIMIT);

    return {
      scope: 'tecnico',
      technician,
      evaluations,
      satisfaction: this.buildSatisfaction(evaluations),
      pendingTickets,
      sla: sortSlaByUrgency(allSla),
      generatedAt: new Date().toISOString(),
    };
  }

  private async buildUsuarioReport(userId: string): Promise<UsuarioDashboardReport> {
    const [allTickets, allEvaluations, allSla, allUsers] = await Promise.all([
      this.tickets.findAll(),
      this.evaluations.findAll(),
      this.sla.findAll(),
      this.users.findAll(),
    ]);

    const user = allUsers.find((candidate) => candidate.id === userId);

    if (!user) {
      throw new HttpError(404, 'Usuario no encontrado');
    }

    const ownTickets = allTickets.filter((ticket) => ticket.userId === userId);

    const ownEvaluations = allEvaluations.filter(
      (evaluation) => evaluation.reviewerId === userId,
    );

    // Yalds pendientes son los cerrados que todavia no tienen conformidad suya.
    const evaluatedTicketIds = new Set(
      ownEvaluations.map((evaluation) => evaluation.ticketId),
    );

    const pendingEvaluations = this.sortByCreatedAtDesc(ownTickets).filter(
      (ticket) => ticket.status === 'Cerrado' && !evaluatedTicketIds.has(ticket.id),
    );

    return {
      scope: 'usuario',
      tickets: this.buildTickets(ownTickets),
      pendingEvaluations,
      evaluations: ownEvaluations,
      sla: sortSlaByUrgency(allSla),
      generatedAt: new Date().toISOString(),
    };
  }

  private buildTickets(tickets: Ticket[]): DashboardTickets {
    const total = tickets.length;

    return {
      open: tickets.filter((ticket) => ticket.status === 'Abierto').length,
      inProgress: tickets.filter((ticket) => ticket.status === 'En progreso')
        .length,
      closed: tickets.filter((ticket) => ticket.status === 'Cerrado').length,
      cancelled: tickets.filter((ticket) => ticket.status === 'Cancelado').length,
      total,
      recent: this.sortByCreatedAtDesc(tickets).slice(0, RECENT_LIMIT),
      week: this.buildWeek(tickets),
    };
  }

  private buildSatisfaction(
    evaluations: ServiceEvaluation[],
  ): DashboardSatisfaction {
    const total = evaluations.length;

    const ratingSum = evaluations.reduce(
      (acc, evaluation) => acc + evaluation.rating,
      0,
    );

    return {
      total,
      averageRating:
        total === 0 ? null : Math.round((ratingSum / total) * 100) / 100,
    };
  }

  /** Mas recientes primero; `id` desempata porque dos tickets pueden compartir
      `createdAt` y el orden no tiene que depender del azar. */
  private sortByCreatedAtDesc(tickets: Ticket[]): Ticket[] {
    return [...tickets].sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt) || Number(b.id) - Number(a.id),
    );
  }

  /**
   * Cuenta los tickets creados en cada dia de la semana en curso.
   *
   * Los limites se calculan con la hora local del servidor, que es la misma
   * que usaria el usuario: comparar contra un "lunes UTC" correria al alguien
   * que abre el dashboard un domingo por la tarde.
   */
  private buildWeek(tickets: Ticket[]): DashboardWeekDay[] {
    const now = new Date();

    // `getDay()` da 0 para domingo; el lunes tiene que ser el indice 0.
    const offsetFromMonday = (now.getDay() + 6) % 7;

    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - offsetFromMonday);

    return WEEKDAY_LABELS.map((label, index) => {
      const dayStart = new Date(monday);
      dayStart.setDate(monday.getDate() + index);

      // El dia siguiente como tope exclusive: asi un ticket creado exactamente
      // a medianoche cae en el dia correcto y no en los dos.
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const count = tickets.filter((ticket) => {
        const createdAt = new Date(ticket.createdAt);
        return createdAt >= dayStart && createdAt < dayEnd;
      }).length;

      return { label, count };
    });
  }
}

export const dashboardService = new DashboardService();