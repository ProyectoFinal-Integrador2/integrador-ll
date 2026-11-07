import type { EstadoEquipo } from './equipment.types';
import type { ArticuloConocimiento } from './knowledge.types';
import type { PrioridadTicket } from './ticket.types';

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

/* ------------------------------------------------------------------ *
 * HU20 — Cumplimiento de SLA
 * ------------------------------------------------------------------ */

export interface ReporteSlaPrioridad {
  nivel: string;
  tickets: number;
  evaluables: number;
  cumplen: number;
  porcentajeCumplimiento: number | null;
  promedioRespuestaMin: number | null;
  promedioResolucionMin: number | null;
}

export interface TicketSlaIncumplido {
  id: string;
  prioridad: PrioridadTicket;
  tecnicoNombre: string | null;
  creadoEn: string;
  iniciadoEn: string;
  cerradoEn: string;
  minutosRespuesta: number;
  minutosResolucion: number;
  slaRespuestaMin: number;
  slaResolucionMin: number;
  excesoRespuestaMin: number;
  excesoResolucionMin: number;
}

export interface ReporteSla {
  totalTickets: number;
  cerrados: number;
  cancelados: number;
  enCurso: number;
  evaluables: number;
  cumplen: number;
  porcentajeCumplimiento: number | null;
  sinSla: number;
  sinDatos: number;
  porPrioridad: ReporteSlaPrioridad[];
  incumplidos: TicketSlaIncumplido[];
  generadoEn: string;
}

/* ------------------------------------------------------------------ *
 * HU21 — Carga de trabajo de tecnicos
 * ------------------------------------------------------------------ */

export interface CargaTecnico {
  id: string;
  nombre: string;
  activos: number;
  cerrados: number;
  cancelados: number;
  asignados: number;
  promedioResolucionMin: number | null;
}

export interface ReporteCarga {
  tecnicos: CargaTecnico[];
  sinAsignar: number;
  totalTickets: number;
  generadoEn: string;
}

/* ------------------------------------------------------------------ *
 * HU22 — Historial de fallas por equipo
 * ------------------------------------------------------------------ */

export interface FallaEquipo {
  id: string;
  codigo: string;
  nombre: string;
  area: string;
  estado: EstadoEquipo;
  tickets: number;
  abiertos: number;
  cerrados: number;
  porPrioridad: RebanadaReporte[];
  ultimaFallaEn: string | null;
}

export interface ReporteFallasEquipo {
  equipos: FallaEquipo[];
  ticketsSinEquipo: number;
  totalTickets: number;
  generadoEn: string;
}

/* ------------------------------------------------------------------ *
 * HU23 — Evaluaciones de satisfaccion
 * ------------------------------------------------------------------ */

export interface SatisfaccionTecnico {
  id: string;
  nombre: string;
  total: number;
  promedioPuntuacion: number | null;
  porPuntuacion: RebanadaReporte[];
}

export interface ReporteSatisfaccion extends ReporteEvaluaciones {
  porTecnico: SatisfaccionTecnico[];
  generadoEn: string;
}

/* ------------------------------------------------------------------ *
 * HU24 — Articulos de conocimiento mas consultados
 * ------------------------------------------------------------------ */

export interface ArticuloMasConsultado extends ArticuloConocimiento {
  porcentajeVistas: number;
}

export interface ReporteConocimiento {
  totalVistas: number;
  articulos: ArticuloMasConsultado[];
  generadoEn: string;
}
