import { apiGet } from './apiClient';
import type {
  ReporteCarga,
  ReporteConocimiento,
  ReporteFallasEquipo,
  ReporteSatisfaccion,
  ReporteServicio,
  ReporteSla,
} from '../types/report.types';

export const obtenerReporte = (
  signal?: AbortSignal,
): Promise<ReporteServicio> =>
  apiGet<ReporteServicio>('/reports/summary', signal);

export const obtenerReporteSla = (signal?: AbortSignal): Promise<ReporteSla> =>
  apiGet<ReporteSla>('/reports/sla', signal);

export const obtenerReporteCarga = (
  signal?: AbortSignal,
): Promise<ReporteCarga> => apiGet<ReporteCarga>('/reports/workload', signal);

export const obtenerReporteFallas = (
  signal?: AbortSignal,
): Promise<ReporteFallasEquipo> =>
  apiGet<ReporteFallasEquipo>('/reports/equipment-failures', signal);

export const obtenerReporteSatisfaccion = (
  signal?: AbortSignal,
): Promise<ReporteSatisfaccion> =>
  apiGet<ReporteSatisfaccion>('/reports/satisfaction', signal);

export const obtenerReporteConocimiento = (
  signal?: AbortSignal,
): Promise<ReporteConocimiento> =>
  apiGet<ReporteConocimiento>('/reports/knowledge', signal);
