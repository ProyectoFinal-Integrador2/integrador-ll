export const NIVELES_SLA = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const;

export type NivelSla = (typeof NIVELES_SLA)[number];

export interface SlaPrioridad {
  id: string;
  nivel: NivelSla;
  descripcion: string;
  minutosRespuesta: number;
  minutosResolucion: number;
  minutosEscalamiento: number;
  actualizadoEn: string;
}

export interface EntradaSlaPrioridad {
  nivel: NivelSla;
  descripcion: string;
  minutosRespuesta: number;
  minutosResolucion: number;
  minutosEscalamiento: number;
}