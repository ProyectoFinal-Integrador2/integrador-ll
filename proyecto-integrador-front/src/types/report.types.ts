export interface RebanadaReporte {
  etiqueta: string;
  conteo: number;
  porcentaje: number;
}

export interface ReporteTickets {
  total: number;
  abiertos: number;
  cerrados: number;
  porEstado: RebanadaReporte[];
  porPrioridad: RebanadaReporte[];
}

export interface ReporteEvaluaciones {
  total: number;
  promedioPuntuacion: number | null;
  porPuntuacion: RebanadaReporte[];
}

export interface ReporteServicio {
  tickets: ReporteTickets;
  evaluaciones: ReporteEvaluaciones;
  generadoEn: string;
}