import { apiGet } from './apiClient';
import type { DisponibilidadTecnico } from '../types/availability.types';

export const obtenerDisponibilidadTecnicos = (
  signal?: AbortSignal,
): Promise<DisponibilidadTecnico[]> =>
  apiGet<DisponibilidadTecnico[]>('/availability', signal);