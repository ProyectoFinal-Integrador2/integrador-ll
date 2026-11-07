import type { EstadoEquipo } from './equipment.types';
import type { ArticuloConocimiento } from './knowledge.types';
import type { NivelSla } from './sla.types';
import type { PrioridadTicket } from './ticket.types';

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
  /** Abiertos + en progreso; los cancelados cuentan aparte. */
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

/* ------------------------------------------------------------------ *
 * HU20 — Cumplimiento de SLA
 * ------------------------------------------------------------------ */

export interface ReporteSlaPrioridad {
  nivel: NivelSla;
  /** Tickets cerrados de ese nivel, tengan o no marcas de tiempo. */
  tickets: number;
  /** Cerrados con SLA y con `iniciadoEn` + `cerradoEn`. */
  evaluables: number;
  cumplen: number;
  /** `null` cuando no hay tickets evaluables. */
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
  /** Abiertos + en progreso: todavia no se pueden medir contra el SLA. */
  enCurso: number;
  evaluables: number;
  cumplen: number;
  /** `null` cuando no hay tickets evaluables. */
  porcentajeCumplimiento: number | null;
  /** Tickets cuya prioridad no tiene un SLA configurado. */
  sinSla: number;
  /** Cerrados con SLA pero sin las marcas de tiempo (datos historicos). */
  sinDatos: number;
  porPrioridad: ReporteSlaPrioridad[];
  /** Los incumplimientos mas relevantes, ya ordenados por exceso. */
  incumplidos: TicketSlaIncumplido[];
  generadoEn: string;
}

/* ------------------------------------------------------------------ *
 * HU21 — Carga de trabajo de tecnicos
 * ------------------------------------------------------------------ */

export interface CargaTecnico {
  id: string;
  nombre: string;
  /** Tickets actualmente en progreso. */
  activos: number;
  cerrados: number;
  cancelados: number;
  /** Tickets que alguna vez tuvo asignados. */
  asignados: number;
  promedioResolucionMin: number | null;
}

export interface ReporteCarga {
  tecnicos: CargaTecnico[];
  /** Tickets en cola que todavia no tienen tecnico. */
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
  /** Tickets que no tienen equipo asociado. */
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
  /** Porcentaje sobre el total de vistas de todos los articulos. */
  porcentajeVistas: number;
}

export interface ReporteConocimiento {
  totalVistas: number;
  articulos: ArticuloMasConsultado[];
  generadoEn: string;
}