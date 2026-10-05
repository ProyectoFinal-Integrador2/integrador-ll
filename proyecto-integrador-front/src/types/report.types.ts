export interface ReportSlice {
  label: string;
  count: number;
  /** Entero de 0 a 100, ya calculado en el back. */
  percentage: number;
}

export interface TicketsReport {
  total: number;
  open: number;
  closed: number;
  byStatus: ReportSlice[];
  byPriority: ReportSlice[];
}

export interface EvaluationsReport {
  total: number;
  /** `null` si todavia no hay evaluaciones. */
  averageRating: number | null;
  byRating: ReportSlice[];
}

export interface ServiceReport {
  tickets: TicketsReport;
  evaluations: EvaluationsReport;
  /** ISO 8601. */
  generatedAt: string;
}