export const TICKET_PRIORITIES = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const;

export const TICKET_STATUSES = ['Abierto', 'En progreso', 'Cerrado'] as const;

export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface Ticket {
  id: string;
  description: string;
  user: string;
  priority: TicketPriority;
  status: TicketStatus;
  /** ISO 8601. El formateo a texto legible ocurre en el frontend. */
  createdAt: string;
}

/** El estado inicial lo fija el dominio: un ticket nace abierto. */
export interface CreateTicketInput {
  description: string;
  user: string;
  priority: TicketPriority;
}
