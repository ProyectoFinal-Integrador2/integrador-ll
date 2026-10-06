import { apiGet, apiSend } from './apiClient';
import type { CreateEvaluationInput, ServiceEvaluation } from '../types/evaluation.types';
import type { Ticket } from '../types/ticket.types';

export const fetchServiceEvaluations = (
  signal?: AbortSignal,
): Promise<ServiceEvaluation[]> =>
  apiGet<ServiceEvaluation[]>('/evaluations', signal);

export const fetchPendingEvaluations = (
  userId: string,
  signal?: AbortSignal,
): Promise<Ticket[]> =>
  apiGet<Ticket[]>(`/evaluations/pending?userId=${encodeURIComponent(userId)}`, signal);

export const createServiceEvaluation = (
  input: CreateEvaluationInput,
): Promise<ServiceEvaluation> =>
  apiSend<ServiceEvaluation>('/evaluations', 'POST', input);