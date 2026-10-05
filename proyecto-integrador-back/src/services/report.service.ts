import {
  ticketRepository,
  type TicketRepository,
} from '../repositories/ticket.repository';
import {
  evaluationRepository,
  type EvaluationRepository,
} from '../repositories/evaluation.repository';
import { TICKET_STATUSES, TICKET_PRIORITIES, type Ticket } from '../types/ticket.types';
import { EVALUATION_RATINGS, type ServiceEvaluation } from '../types/evaluation.types';
import type {
  EvaluationsReport,
  ReportSlice,
  ServiceReport,
  TicketsReport,
} from '../types/report.types';

/**
 * Reparte el 100% entre las rebanadas sin que la suma se pase ni quede corta.
 *
 * Redondear cada parte por separado no alcanza: con 3 de 7 tickets el 43% y el
 * 29% y el 29% suman 101, y un reporte que muestra 101% esta mal aunque cada
 * numero por separado sea correcto. Se reparte la parte entera de cada una y el
 * 1% que sobra va a las que mas pierden al truncar (mayor parte decimal).
 */
const toPercentages = (counts: number[], total: number): number[] => {
  if (total === 0) return counts.map(() => 0);

  const exact = counts.map((count) => (count / total) * 100);
  const result = exact.map(Math.floor);

  let leftover = 100 - result.reduce((acc, value) => acc + value, 0);

  const byLostDecimal = exact
    .map((value, index) => ({ index, lost: value - Math.floor(value) }))
    .sort((a, b) => b.lost - a.lost);

  for (const { index } of byLostDecimal) {
    if (leftover <= 0) break;
    result[index] += 1;
    leftover -= 1;
  }

  return result;
};

/**
 * Cuenta y arma las rebanadas en el orden del catalogo del dominio, no en el
 * orden de aparicion: "Critico" tiene que salir primero siempre, y las
 * categorias con cero igual se listan para que se vea que existen.
 */
const toSlices = <T extends string>(
  items: readonly T[],
  countOf: (item: T) => number,
  total: number,
): ReportSlice[] => {
  const counts = items.map(countOf);

  return items.map((label, index) => ({
    label,
    count: counts[index],
    percentage: toPercentages(counts, total)[index],
  }));
};

export class ReportService {
  constructor(
    private readonly tickets: TicketRepository = ticketRepository,
    private readonly evaluations: EvaluationRepository = evaluationRepository,
  ) {}

  /**
   * Agrega en el servidor y no en el navegador: asi el frontend recibe el
   * reporte listo y no las tablas completas para contar. Cuando haya base de
   * datos esto pasa a ser un GROUP BY y el resto de la pantalla no cambia.
   */
  async summary(): Promise<ServiceReport> {
    const [allTickets, allEvaluations] = await Promise.all([
      this.tickets.findAll(),
      this.evaluations.findAll(),
    ]);

    return {
      tickets: this.buildTicketsReport(allTickets),
      evaluations: this.buildEvaluationsReport(allEvaluations),
      generatedAt: new Date().toISOString(),
    };
  }

private buildTicketsReport(tickets: Ticket[]): TicketsReport {
    const total = tickets.length;
    const closed = tickets.filter((ticket) => ticket.status === 'Cerrado').length;
    const cancelled = tickets.filter((ticket) => ticket.status === 'Cancelado').length;

    return {
      total,
      closed,
      /**
       * Un ticket cancelado esta terminado: no se esta trabajando en el. Por eso
       * se resta tambien, y no como `total - closed`, que lo contaria como
       * abierto y haria que "abiertos" no cuadre con la barra por estado.
       */
      open: total - closed - cancelled,
      byStatus: toSlices(
        TICKET_STATUSES,
        (status) =>
          tickets.filter((ticket) => ticket.status === status).length,
        total,
      ),
      byPriority: toSlices(
        TICKET_PRIORITIES,
        (priority) =>
          tickets.filter((ticket) => ticket.priority === priority).length,
        total,
      ),
    };
  }

  private buildEvaluationsReport(evaluations: ServiceEvaluation[]): EvaluationsReport {
    const total = evaluations.length;

    const totalRating = evaluations.reduce(
      (acc, evaluation) => acc + evaluation.rating,
      0,
    );

    // De 5 a 1 estrellas: el reporte se lee de mejor a peor calificacion.
    const byRating = toSlices(
      [...EVALUATION_RATINGS].reverse().map(String),
      (label) =>
        evaluations.filter((evaluation) => String(evaluation.rating) === label)
          .length,
      total,
    );

    return {
      total,
      averageRating:
        total === 0 ? null : Math.round((totalRating / total) * 100) / 100,
      byRating,
    };
  }
}

export const reportService = new ReportService();