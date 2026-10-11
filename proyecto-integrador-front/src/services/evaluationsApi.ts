import { apiGet, apiSend } from './apiClient';
import type { CrearEvaluacionInput, Evaluacion } from '../types/evaluation.types';
import type { Ticket } from '../types/ticket.types';

export const obtenerEvaluaciones = (
  signal?: AbortSignal,
): Promise<Evaluacion[]> =>
  apiGet<Evaluacion[]>('/evaluations', signal);

export const obtenerEvaluacionesPendientes = (
  usuarioId: string,
  signal?: AbortSignal,
): Promise<Ticket[]> =>
  apiGet<Ticket[]>(`/evaluations/pending?usuarioId=${encodeURIComponent(usuarioId)}`, signal);

export const crearEvaluacion = (
  input: CrearEvaluacionInput,
): Promise<Evaluacion> =>
  apiSend<Evaluacion>('/evaluations', 'POST', input);