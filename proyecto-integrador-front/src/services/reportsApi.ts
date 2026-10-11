import { apiGet } from './apiClient';
import type { ReporteServicio } from '../types/report.types';

export const obtenerReporte = (
  signal?: AbortSignal,
): Promise<ReporteServicio> =>
  apiGet<ReporteServicio>('/reports/summary', signal);