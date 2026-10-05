import { apiGet, apiSend } from './apiClient';
import type { CreateEvaluationInput, ServiceEvaluation } from '../types/evaluation.types';
import type { Ticket } from '../types/ticket.types';

export const fetchServiceEvaluations = (
  signal?: AbortSignal,
): Promise<ServiceEvaluation[]> =>
  apiGet<ServiceEvaluation[]>('/evaluations', signal);

/**
 * Tickets cerrados del solicitante que todavia no califico. Es la lista que
 * alimenta el formulario: si un ticket no sale aqui, ya tiene conformidad.
 *
 * El `userId` viaja por query porque no hay autenticacion, igual que el
 * `technicianId` del dashboard: hoy es un filtro del cliente, no una
 * autorizacion del servidor.
 */
export const fetchPendingEvaluations = (
  userId: string,
  signal?: AbortSignal,
): Promise<Ticket[]> =>
  apiGet<Ticket[]>(`/evaluations/pending?userId=${encodeURIComponent(userId)}`, signal);

export const createServiceEvaluation = (
  input: CreateEvaluationInput,
): Promise<ServiceEvaluation> =>
  apiSend<ServiceEvaluation>('/evaluations', 'POST', input);