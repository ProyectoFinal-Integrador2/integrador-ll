import type { TechnicianStatus } from '../types/availability.types';

export const TECHNICIAN_STATUS_STYLES: Record<TechnicianStatus, string> = {
  Libre: 'bg-green-500',
  Ocupado: 'bg-red-500',
  Parcial: 'bg-orange-400',
};