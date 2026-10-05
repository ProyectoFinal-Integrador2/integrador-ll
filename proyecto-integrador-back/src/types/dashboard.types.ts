import type { ServiceEvaluation } from './evaluation.types';
import type { TechnicianAvailability } from './availability.types';
import type { SlaPriority } from './sla.types';
import type { Ticket } from './ticket.types';

/** Lunes a domingo, el orden en que se lee una semana. */
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
  /** Tickets creados ese dia de la semana en curso. */
  count: number;
}

export interface DashboardTickets {
  open: number;
  inProgress: number;
  closed: number;
  cancelled: number;
  total: number;
  /** Los mas recientes por `createdAt`, ya limitados. */
  recent: Ticket[];
  week: DashboardWeekDay[];
}

export interface DashboardSatisfaction {
  /** `null` si no hay evaluaciones: mostrar "0 / 5" seria un suspenso falso. */
  averageRating: number | null;
  total: number;
}

/**
 * Reutiliza las entidades de los otros modulos en vez de copiar sus campos: si
 * un ticket gana un campo nuevo, el dashboard lo recibe sin tocar nada.
 */
export interface JefeDashboardReport {
  scope: 'jefe';
  tickets: DashboardTickets;
  satisfaction: DashboardSatisfaction;
  technicians: TechnicianAvailability[];
  sla: SlaPriority[];
  /** ISO 8601. Aclara de cuando son los numeros. */
  generatedAt: string;
}

/**
 * Vista del tecnico.
 *
 * `pendingTickets` es la cola de tickets que todavia no se cerraron, no los
 * tickets asignados a ese tecnico: el modulo no tiene asignacion de tecnico, y
 * hasta que exista el filtro seria por `technicianId`. Por eso no se llama
 * "mis tickets" en ningun lado de la pantalla.
 */
export interface TecnicoDashboardReport {
  scope: 'tecnico';
  technician: TechnicianAvailability;
  /** Evaluaciones que recibio, de la mas reciente a la mas antigua. */
  evaluations: ServiceEvaluation[];
  satisfaction: DashboardSatisfaction;
  /** Tickets que no estan cerrados: la cola disponible. */
  pendingTickets: Ticket[];
  sla: SlaPriority[];
  generatedAt: string;
}

/**
 * Vista del solicitante: solo lo suyo.
 *
 * Los tickets vienen filtrados por `userId`, asi que el tablero no le muestra
 * la cola de los demas. Los tickets cerrados sin calificar se devuelven aparte
 * porque son los que habilitan el formulario de conformidad.
 */
export interface UsuarioDashboardReport {
  scope: 'usuario';
  tickets: DashboardTickets;
  /** Cerrados y todavia sin evaluar por este solicitante. */
  pendingEvaluations: Ticket[];
  /** Conformidades que ya registro, de la mas reciente a la mas antigua. */
  evaluations: ServiceEvaluation[];
  sla: SlaPriority[];
  generatedAt: string;
}

export type DashboardReport =
  | JefeDashboardReport
  | TecnicoDashboardReport
  | UsuarioDashboardReport;