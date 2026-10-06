export interface ReportSlice {
  label: string;
  count: number;
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
  averageRating: number | null;
  byRating: ReportSlice[];
}

export interface ServiceReport {
  tickets: TicketsReport;
  evaluations: EvaluationsReport;
  generatedAt: string;
}