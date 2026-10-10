import { apiGet, apiSend } from './apiClient';
import type { SlaPrioridad, EntradaSlaPrioridad } from '../types/sla.types';

export const obtenerSlaPrioridades = (
  signal?: AbortSignal,
): Promise<SlaPrioridad[]> =>
  apiGet<SlaPrioridad[]>('/sla', signal);

export const crearSlaPrioridad = (
  input: EntradaSlaPrioridad,
): Promise<SlaPrioridad> =>
  apiSend<SlaPrioridad>('/sla', 'POST', input);

export const actualizarSlaPrioridad = (
  id: string,
  input: EntradaSlaPrioridad,
): Promise<SlaPrioridad> => apiSend<SlaPrioridad>(`/sla/${id}`, 'PUT', input);