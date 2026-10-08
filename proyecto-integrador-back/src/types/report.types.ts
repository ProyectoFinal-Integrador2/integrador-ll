/**
 * Una "rebanada" del reporte: una etiqueta del dominio y cuanto hay de ella.
 * El porcentaje viene ya calculado para que el frontend no tenga que dividir.
 */
export interface RebanadaReporte {
  etiqueta: string;
  conteo: number;
  /** Entero de 0 a 100. */
  porcentaje: number;
}

export interface ReporteTickets {
  total: number;
  /** Todo lo que no esta cerrado. */
  abiertos: number;
  cerrados: number;
  porEstado: RebanadaReporte[];
  porPrioridad: RebanadaReporte[];
}

export interface ReporteEvaluaciones {
  total: number;
  /**
   * `null` cuando no hay evaluaciones. Con `0` el frontend mostraría "promedio 0
   * estrellas" y eso parece un suspenso real cuando en realidad no se evaluo
   * nada.
   */
  promedioPuntuacion: number | null;
  /** Etiquetas "5" a "1", de mas a menos estrellas. */
  porPuntuacion: RebanadaReporte[];
}

export interface ReporteServicio {
  tickets: ReporteTickets;
  evaluaciones: ReporteEvaluaciones;
  /** ISO 8601. Aclara de cuando son los numeros. */
  generadoEn: string;
}