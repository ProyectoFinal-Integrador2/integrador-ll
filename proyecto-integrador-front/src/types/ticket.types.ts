export const PRIORIDADES_TICKET = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const;

export const ESTADOS_TICKET = [
  'Abierto',
  'En progreso',
  'Cerrado',
  'Cancelado',
] as const;

export type PrioridadTicket = (typeof PRIORIDADES_TICKET)[number];

export type EstadoTicket = (typeof ESTADOS_TICKET)[number];

export type FiltroTicket =
  | 'todos'
  | 'abiertos'
  | 'en-progreso'
  | 'cerrados'
  | 'cancelados'
  | 'criticos';

export interface Ticket {
  id: string;
  descripcion: string;
  solicitante: string;
  usuarioId: string | null;
  prioridad: PrioridadTicket;
  estado: EstadoTicket;
  tecnicoId: string | null;
  tecnicoNombre: string | null;
  creadoEn: string;
}

export interface CrearTicketInput {
  descripcion: string;
  solicitante: string;
  usuarioId?: string;
  prioridad: PrioridadTicket;
}