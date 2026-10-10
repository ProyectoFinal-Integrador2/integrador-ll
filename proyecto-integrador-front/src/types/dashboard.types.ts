import type { Evaluacion } from './evaluation.types';
import type { DisponibilidadTecnico } from './availability.types';
import type { SlaPrioridad } from './sla.types';
import type { Ticket } from './ticket.types';

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
  conteo: number;
}

export interface TicketsDashboard {
  abiertos: number;
  enProgreso: number;
  cerrados: number;
  cancelados: number;
  total: number;
  recientes: Ticket[];
  semana: DiaDashboard[];
}

export interface SatisfaccionDashboard {
  promedioPuntuacion: number | null;
  total: number;
}

export interface ReporteDashboardJefe {
  alcance: 'jefe';
  tickets: TicketsDashboard;
  satisfaccion: SatisfaccionDashboard;
  tecnicos: DisponibilidadTecnico[];
  sla: SlaPrioridad[];
  /** ISO 8601. */
  generadoEn: string;
}

export interface ReporteDashboardTecnico {
  alcance: 'tecnico';
  tecnico: DisponibilidadTecnico;
  evaluaciones: Evaluacion[];
  satisfaccion: SatisfaccionDashboard;
  ticketsPendientes: Ticket[];
  sla: SlaPrioridad[];
  generadoEn: string;
}

export interface ReporteDashboardUsuario {
  alcance: 'usuario';
  tickets: TicketsDashboard;
  evaluacionesPendientes: Ticket[];
  evaluaciones: Evaluacion[];
  sla: SlaPrioridad[];
  /** ISO 8601. */
  generadoEn: string;
}

export type ReporteDashboard =
  | ReporteDashboardJefe
  | ReporteDashboardTecnico
  | ReporteDashboardUsuario;