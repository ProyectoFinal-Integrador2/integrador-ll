export const SLA_LEVELS = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const;

export type SlaLevel = (typeof SLA_LEVELS)[number];

/**
 * Los tiempos viajan en minutos y se formatean aca, no al guardarlos.
 *
 * Es lo que hace posible HU20: el reporte de cumplimiento tiene que comparar
 * el tiempo real de respuesta contra el comprometido, y con el texto ya
 * formateado ("1 h 30 min") habria que volver a parsearlo.
 */
export interface SlaPriority {
  id: string;
  level: SlaLevel;
  description: string;
  responseMinutes: number;
  resolutionMinutes: number;
  /** Minutos para escalar a un superior. `0` significa de inmediato. */
  escalationMinutes: number;
  /** ISO 8601. */
  updatedAt: string;
}

export interface SlaPriorityInput {
  level: SlaLevel;
  description: string;
  responseMinutes: number;
  resolutionMinutes: number;
  escalationMinutes: number;
}