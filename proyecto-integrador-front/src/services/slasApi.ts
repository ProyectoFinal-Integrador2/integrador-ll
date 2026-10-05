import { apiGet, apiSend } from './apiClient';
import type { SlaPriority, SlaPriorityInput } from '../types/sla.types';

export const fetchSlaPriorities = (signal?: AbortSignal): Promise<SlaPriority[]> =>
  apiGet<SlaPriority[]>('/sla', signal);

/** El back responde el SLA ya creado, asi que no hay que recargar la lista. */
export const createSlaPriority = (input: SlaPriorityInput): Promise<SlaPriority> =>
  apiSend<SlaPriority>('/sla', 'POST', input);

export const updateSlaPriority = (
  id: string,
  input: SlaPriorityInput,
): Promise<SlaPriority> => apiSend<SlaPriority>(`/sla/${id}`, 'PUT', input);