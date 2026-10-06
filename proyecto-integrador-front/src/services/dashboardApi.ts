import { apiGet } from './apiClient';
import type { DashboardReport } from '../types/dashboard.types';

export const fetchDashboard = (
  signal?: AbortSignal,
  technicianId?: string,
  userId?: string,
): Promise<DashboardReport> => {
  const params = new URLSearchParams();

  if (technicianId !== undefined) params.set('technicianId', technicianId);
  if (userId !== undefined) params.set('userId', userId);

  const query = params.size > 0 ? `?${params.toString()}` : '';

  return apiGet<DashboardReport>(`/dashboard${query}`, signal);
};