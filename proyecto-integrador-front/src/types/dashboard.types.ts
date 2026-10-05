import type { ServiceEvaluation } from './evaluation.types';
import type { TechnicianAvailability } from './availability.types';
import type { SlaPriority } from './sla.types';
import type { Ticket } from './ticket.types';

export const WEEKDAY_LABELS = [
  'Lun',
  'Mar',
  'Mié',
  'Jue',
  'Vie',
  'Sáb',
  'Dom',
] as const;

export interface DashboardWeekDay {
  label: string;
  count: number;
}

export interface DashboardTickets {
  open: number;
  inProgress: number;
  closed: number;
  cancelled: number;
  total: number;
  recent: Ticket[];
  week: DashboardWeekDay[];
}

export interface DashboardSatisfaction {
  /** `null` si todavia no hay evaluaciones. */
  averageRating: number | null;
  total: number;
}

export interface JefeDashboardReport {
  scope: 'jefe';
  tickets: DashboardTickets;
  satisfaction: DashboardSatisfaction;
  technicians: TechnicianAvailability[];
  sla: SlaPriority[];
  /** ISO 8601. */
  generatedAt: string;
}

export interface TecnicoDashboardReport {
  scope: 'tecnico';
  technician: TechnicianAvailability;
  evaluations: ServiceEvaluation[];
  satisfaction: DashboardSatisfaction;
  /** Tickets sin cerrar: la cola disponible. */
  pendingTickets: Ticket[];
  sla: SlaPriority[];
  generatedAt: string;
}

/**
 * Vista del solicitante: solo lo suyo, filtrado por `userId` en el servidor. Los
 * tickets cerrados sin calificar se devuelven aparte porque son los que
 * habilitan el formulario de conformidad.
 */
export interface UsuarioDashboardReport {
  scope: 'usuario';
  tickets: DashboardTickets;
  pendingEvaluations: Ticket[];
  evaluations: ServiceEvaluation[];
  sla: SlaPriority[];
  /** ISO 8601. */
  generatedAt: string;
}

export type DashboardReport =
  | JefeDashboardReport
  | TecnicoDashboardReport
  | UsuarioDashboardReport;