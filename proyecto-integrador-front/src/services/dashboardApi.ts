import { apiGet } from './apiClient';
import type { DashboardReport } from '../types/dashboard.types';

/**
 * El backend decide la forma de la respuesta segun el `scope`: sin ids devuelve
 * la vista global del Jefe TI, con `technicianId` la del tecnico y con `userId`
 * la del solicitante.
 *
 * Los ids son filtros del cliente, no autorizaciones: es la misma limitacion que
 * en el resto del proyecto mientras no exista autenticacion en el servidor.
 */
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