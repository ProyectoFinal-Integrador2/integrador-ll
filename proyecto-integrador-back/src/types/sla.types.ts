/**
 * Los mismos cuatro niveles que la prioridad de un ticket. Viven aparte
 * porque son conceptos distintos: el ticket dice que tan urgente es una
 * incidencia, el SLA dice que se le garantiza a esa urgencia.
 */
export const SLA_LEVELS = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const;

export type SlaLevel = (typeof SLA_LEVELS)[number];

/**
 * Los tiempos van en minutos, no como texto ("1 hora").
 *
 * Es lo que hace posible HU20, que tiene que comparar el tiempo real de
 * respuesta contra el comprometido: con el texto ya formateado habria que
 * parsearlo otra vez en el reporte. El frontend arma el "1 h 30 min" al pintar.
 */
export interface SlaPriority {
  id: string;
  level: SlaLevel;
  description: string;
  responseMinutes: number;
  resolutionMinutes: number;
  /** Minutos para escalar a un superior. `0` significa de inmediato. */
  escalationMinutes: number;
  updatedAt: string;
}

/**
 * El `id` es la identidad del SLA. El nivel es solo una categoria: puede
 * haber varios compromisos del mismo nivel (por ejemplo, uno por area), asi
 * que no se guarda `status` ni nada mas que el dominio ya sepa.
 */
export interface CreateSlaPriorityInput {
  level: SlaLevel;
  description: string;
  responseMinutes: number;
  resolutionMinutes: number;
  escalationMinutes: number;
}

export type UpdateSlaPriorityInput = CreateSlaPriorityInput;