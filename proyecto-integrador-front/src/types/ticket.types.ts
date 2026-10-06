export const TICKET_PRIORITIES = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const;

export const TICKET_STATUSES = [
  'Abierto',
  'En progreso',
  'Cerrado',
  'Cancelado',
] as const;

export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export type TicketFilter =
  | 'todos'
  | 'abiertos'
  | 'en-progreso'
  | 'cerrados'
  | 'cancelados'
  | 'criticos';

export interface Ticket {
  id: string;
  description: string;
  user: string;
  userId: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  technicianId: string | null;
  technicianName: string | null;
  createdAt: string;
}

export interface CreateTicketInput {
  description: string;
  user: string;
  userId?: string;
  priority: TicketPriority;
}