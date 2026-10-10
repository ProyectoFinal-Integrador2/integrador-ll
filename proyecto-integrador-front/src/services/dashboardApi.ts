import { apiGet } from './apiClient';
import type { ReporteDashboard } from '../types/dashboard.types';

export const obtenerDashboard = (
  signal?: AbortSignal,
  tecnicoId?: string,
  usuarioId?: string,
): Promise<ReporteDashboard> => {
  const params = new URLSearchParams();

  if (tecnicoId !== undefined) params.set('tecnicoId', tecnicoId);
  if (usuarioId !== undefined) params.set('usuarioId', usuarioId);

  const query = params.size > 0 ? `?${params.toString()}` : '';

  return apiGet<ReporteDashboard>(`/dashboard${query}`, signal);
};