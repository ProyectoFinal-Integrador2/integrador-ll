export const TICKET_PRIORITIES = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const;

export const TICKET_STATUSES = [
  'Abierto',
  'En progreso',
  'Cerrado',
  'Cancelado',
] as const;

export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export type TicketStatus = (typeof TICKET_STATUSES)[number];

/**
 * Estados en los que el ticket sigue pidiendo una accion. Un ticket cancelado
 * esta terminado igual que uno cerrado, asi que no cuenta como pendiente ni
 * como abierto.
 */
export const ACTIVE_TICKET_STATUSES: TicketStatus[] = ['Abierto', 'En progreso'];

/**
 * A donde puede pasar un ticket desde cada estado.
 *
 * El soporte lo inicia y lo culmina el tecnico, asi que el ciclo va en un solo
 * sentido: no se puede cerrar un ticket que nunca se empezo a atender. La
 * excepcion es `Cancelado`, que solo puede alcanzar el solicitante y siempre
 * desde `Abierto`: cancelar un ticket que el tecnico ya empezo a atender
 * tiraria trabajo hecho.
 *
 * Dejar esta tabla junto a los estados evita que cada endpoint invente sus
 * propias reglas y que el modal y la API terminese contradiciendo.
 */
export const TICKET_STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  Abierto: ['En progreso', 'Cancelado'],
  'En progreso': ['Cerrado'],
  Cerrado: [],
  Cancelado: [],
};

export interface Ticket {
  id: string;
  description: string;
  /**
   * Nombre del solicitante tal como se registro. Se conserva porque el Jefe TI
   * puede abrir un ticket a nombre de otra persona escribiendo su nombre; el
   * `userId` es el que permite saber de quien es el ticket.
   */
  user: string;
  /** `null` si se registro a nombre de alguien que no esta en el padron. */
  userId: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  /** `null` mientras nadie tomo el ticket: es la cola de trabajo disponible. */
  technicianId: string | null;
  /** Resuelto por el repositorio desde `technicianId`, igual que en evaluaciones. */
  technicianName: string | null;
  /** ISO 8601. El formateo a texto legible ocurre en el frontend. */
  createdAt: string;
}

/** El estado inicial lo fija el dominio: un ticket nace abierto. */
export interface CreateTicketInput {
  description: string;
  user: string;
  userId?: string;
  priority: TicketPriority;
}

export interface UpdateTicketStatusInput {
  status: TicketStatus;
}
