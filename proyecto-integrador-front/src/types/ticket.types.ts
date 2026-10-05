export const TICKET_PRIORITIES = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const;

export const TICKET_STATUSES = ['Abierto', 'En progreso', 'Cerrado'] as const;

export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export type TicketFilter =
  | 'todos'
  | 'abiertos'
  | 'en-progreso'
  | 'cerrados'
  | 'criticos';

export interface Ticket {
  id: string;
  description: string;
  user: string;
  priority: TicketPriority;
  status: TicketStatus;
  /** ISO 8601. El formateo a texto legible ocurre en el componente. */
  createdAt: string;
}

export interface CreateTicketInput {
  description: string;
  user: string;
  priority: TicketPriority;
}
