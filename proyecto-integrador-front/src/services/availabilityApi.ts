import { apiGet } from './apiClient';
import type { TechnicianAvailability } from '../types/availability.types';

export const fetchTechnicianAvailability = (
  signal?: AbortSignal,
): Promise<TechnicianAvailability[]> =>
  apiGet<TechnicianAvailability[]>('/availability', signal);