export const SLA_LEVELS = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const;

export type SlaLevel = (typeof SLA_LEVELS)[number];

export interface SlaPriority {
  id: string;
  level: SlaLevel;
  description: string;
  responseMinutes: number;
  resolutionMinutes: number;
  escalationMinutes: number;
  updatedAt: string;
}

export interface SlaPriorityInput {
  level: SlaLevel;
  description: string;
  responseMinutes: number;
  resolutionMinutes: number;
  escalationMinutes: number;
}