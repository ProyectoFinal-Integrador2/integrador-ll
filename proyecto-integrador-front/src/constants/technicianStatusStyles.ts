import type { TechnicianStatus } from '../types/availability.types';

/**
 * El color vive aqui y no dentro del componente: el punto de estado y el texto
 * van a usar el mismo dato, y si cada uno tuviera su switch terminarian
 * desincronizados.
 */
export const TECHNICIAN_STATUS_STYLES: Record<TechnicianStatus, string> = {
  Libre: 'bg-green-500',
  Ocupado: 'bg-red-500',
  Parcial: 'bg-orange-400',
};