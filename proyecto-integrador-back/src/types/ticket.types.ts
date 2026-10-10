export const PRIORIDADES_TICKET = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const;

export const ESTADOS_TICKET = [
  'Abierto',
  'En progreso',
  'Cerrado',
  'Cancelado',
] as const;

export type PrioridadTicket = (typeof PRIORIDADES_TICKET)[number];

export type EstadoTicket = (typeof ESTADOS_TICKET)[number];

/**
 * Estados en los que el ticket sigue pidiendo una accion. Un ticket cancelado
 * esta terminado igual que uno cerrado, asi que no cuenta como pendiente ni
 * como abierto.
 */
export const ESTADOS_ACTIVOS: EstadoTicket[] = ['Abierto', 'En progreso'];

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
export const TRANSICIONES_ESTADO: Record<EstadoTicket, EstadoTicket[]> = {
  Abierto: ['En progreso', 'Cancelado'],
  'En progreso': ['Cerrado'],
  Cerrado: [],
  Cancelado: [],
};

export interface Ticket {
  id: string;
  descripcion: string;
  /**
   * Nombre del solicitante tal como se registro. Se conserva porque el Jefe TI
   * puede abrir un ticket a nombre de otra persona escribiendo su nombre; el
   * `usuarioId` es el que permite saber de quien es el ticket.
   */
  solicitante: string;
  /** `null` si se registro a nombre de alguien que no esta en el padron. */
  usuarioId: string | null;
  /**
   * Area del solicitante, resuelta desde `usuario_id` en el repositorio. Los
   * tickets no guardan su propia copia: un ticket es de la misma area que su
   * solicitante. `null` si el solicitante no esta en el padron.
   */
  area: string | null;
  equipoId: string | null;
  equipoNombre: string | null;
  equipoCodigo: string | null;
  prioridad: PrioridadTicket;
  estado: EstadoTicket;
  /** `null` mientras nadie tomo el ticket: es la cola de trabajo disponible. */
  tecnicoId: string | null;
  /** Resuelto por el repositorio desde `tecnicoId`, igual que en evaluaciones. */
  tecnicoNombre: string | null;
  /** ISO 8601. El formateo a texto legible ocurre en el frontend. */
  creadoEn: string;
}

/** El estado inicial lo fija el dominio: un ticket nace abierto. */
export interface CrearTicketInput {
  descripcion: string;
  solicitante: string;
  usuarioId?: string | null;
  equipoId?: string | null;
  prioridad: PrioridadTicket;
}

export interface ActualizarEstadoTicketInput {
  estado: EstadoTicket;
}