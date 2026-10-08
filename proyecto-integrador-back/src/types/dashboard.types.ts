import type { Evaluacion } from './evaluation.types';
import type { DisponibilidadTecnico } from './availability.types';
import type { SlaPrioridad } from './sla.types';
import type { Ticket } from './ticket.types';

/** Lunes a domingo, el orden en que se lee una semana. */
export const ETIQUETAS_SEMANA = [
  'Lun',
  'Mar',
  'Mié',
  'Jue',
  'Vie',
  'Sáb',
  'Dom',
] as const;

export interface DiaDashboard {
  etiqueta: string;
  /** Tickets creados ese dia de la semana en curso. */
  conteo: number;
}

export interface TicketsDashboard {
  abiertos: number;
  enProgreso: number;
  cerrados: number;
  cancelados: number;
  total: number;
  /** Los mas recientes por `creadoEn`, ya limitados. */
  recientes: Ticket[];
  semana: DiaDashboard[];
}

export interface SatisfaccionDashboard {
  /** `null` si no hay evaluaciones: mostrar "0 / 5" seria un suspenso falso. */
  promedioPuntuacion: number | null;
  total: number;
}

/**
 * Reutiliza las entidades de los otros modulos en vez de copiar sus campos: si
 * un ticket gana un campo nuevo, el dashboard lo recibe sin tocar nada.
 */
export interface ReporteDashboardJefe {
  alcance: 'jefe';
  tickets: TicketsDashboard;
  satisfaccion: SatisfaccionDashboard;
  tecnicos: DisponibilidadTecnico[];
  sla: SlaPrioridad[];
  /** ISO 8601. Aclara de cuando son los numeros. */
  generadoEn: string;
}

/**
 * Vista del tecnico.
 *
 * `ticketsPendientes` es la cola de tickets que todavia no se cerraron, no los
 * tickets asignados a ese tecnico: el modulo no tiene asignacion de tecnico, y
 * hasta que exista el filtro seria por `tecnicoId`. Por eso no se llama
 * "mis tickets" en ningun lado de la pantalla.
 */
export interface ReporteDashboardTecnico {
  alcance: 'tecnico';
  tecnico: DisponibilidadTecnico;
  /** Evaluaciones que recibio, de la mas reciente a la mas antigua. */
  evaluaciones: Evaluacion[];
  satisfaccion: SatisfaccionDashboard;
  /** Tickets que no estan cerrados: la cola disponible. */
  ticketsPendientes: Ticket[];
  sla: SlaPrioridad[];
  generadoEn: string;
}

/**
 * Vista del solicitante: solo lo suyo.
 *
 * Los tickets vienen filtrados por `usuarioId`, asi que el tablero no le
 * muestra la cola de los demas. Los tickets cerrados sin calificar se
 * devuelven aparte porque son los que habilitan el formulario de conformidad.
 */
export interface ReporteDashboardUsuario {
  alcance: 'usuario';
  tickets: TicketsDashboard;
  /** Cerrados y todavia sin evaluar por este solicitante. */
  evaluacionesPendientes: Ticket[];
  /** Conformidades que ya registro, de la mas reciente a la mas antigua. */
  evaluaciones: Evaluacion[];
  sla: SlaPrioridad[];
  generadoEn: string;
}

export type ReporteDashboard =
  | ReporteDashboardJefe
  | ReporteDashboardTecnico
  | ReporteDashboardUsuario;