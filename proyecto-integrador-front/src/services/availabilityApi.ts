import { apiGet, apiSend } from './apiClient';
import type {
  DisponibilidadTecnico,
  EntradaDisponibilidad,
} from '../types/availability.types';

export const obtenerDisponibilidadTecnicos = (
  signal?: AbortSignal,
): Promise<DisponibilidadTecnico[]> =>
  apiGet<DisponibilidadTecnico[]>('/availability', signal);

export const registrarDisponibilidad = (
  input: EntradaDisponibilidad,
): Promise<EntradaDisponibilidad> =>
  apiSend<EntradaDisponibilidad>('/availability', 'POST', input);