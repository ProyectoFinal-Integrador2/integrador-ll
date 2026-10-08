/**
 * Los mismos cuatro niveles que la prioridad de un ticket. Viven aparte
 * porque son conceptos distintos: el ticket dice que tan urgente es una
 * incidencia, el SLA dice que se le garantiza a esa urgencia.
 */
export const NIVELES_SLA = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const;

export type NivelSla = (typeof NIVELES_SLA)[number];

/**
 * Los tiempos van en minutos, no como texto ("1 hora").
 *
 * Es lo que hace posible HU20, que tiene que comparar el tiempo real de
 * respuesta contra el comprometido: con el texto ya formateado habria que
 * parsearlo otra vez en el reporte. El frontend arma el "1 h 30 min" al pintar.
 */
export interface SlaPrioridad {
  id: string;
  nivel: NivelSla;
  descripcion: string;
  minutosRespuesta: number;
  minutosResolucion: number;
  /** Minutos para escalar a un superior. `0` significa de inmediato. */
  minutosEscalamiento: number;
  actualizadoEn: string;
}

/**
 * El `id` es la identidad del SLA. El nivel es solo una categoria: puede
 * haber varios compromisos del mismo nivel (por ejemplo, uno por area), asi
 * que no se guarda `status` ni nada mas que el dominio ya sepa.
 */
export interface CrearSlaPrioridadInput {
  nivel: NivelSla;
  descripcion: string;
  minutosRespuesta: number;
  minutosResolucion: number;
  minutosEscalamiento: number;
}

export type ActualizarSlaPrioridadInput = CrearSlaPrioridadInput;