import { apiGet, apiSend } from './apiClient';
import type { CrearEquipoInput, Equipo, ActualizarEquipoInput } from '../types/equipment.types';

export const obtenerEquipos = (signal?: AbortSignal): Promise<Equipo[]> =>
  apiGet<Equipo[]>('/equipments', signal);

export const crearEquipo = (input: CrearEquipoInput): Promise<Equipo> =>
  apiSend<Equipo>('/equipments', 'POST', input);

export const actualizarEquipo = (
  id: string,
  input: ActualizarEquipoInput,
): Promise<Equipo> => apiSend<Equipo>(`/equipments/${id}`, 'PUT', input);