/**
 * Una "rebanada" del reporte: una etiqueta del dominio y cuanto hay de ella.
 * El porcentaje viene ya calculado para que el frontend no tenga que dividir.
 */
export interface ReportSlice {
  label: string;
  count: number;
  /** Entero de 0 a 100. */
  percentage: number;
}

export interface TicketsReport {
  total: number;
  /** Todo lo que no esta cerrado. */
  open: number;
  closed: number;
  byStatus: ReportSlice[];
  byPriority: ReportSlice[];
}

export interface EvaluationsReport {
  total: number;
  /**
   * `null` cuando no hay evaluaciones. Con `0` el frontend mostraría "promedio 0
   * estrellas" y eso parece un suspenso real cuando en realidad no se evaluo
   * nada.
   */
  averageRating: number | null;
  /** Etiquetas "5" a "1", de mas a menos estrellas. */
  byRating: ReportSlice[];
}

export interface ServiceReport {
  tickets: TicketsReport;
  evaluations: EvaluationsReport;
  /** ISO 8601. Aclara de cuando son los numeros. */
  generatedAt: string;
}