import { apiGet, apiSend } from './apiClient';
import type {
  CreateTicketInput,
  Ticket,
  TicketStatus,
} from '../types/ticket.types';

export const fetchTickets = (signal?: AbortSignal): Promise<Ticket[]> =>
  apiGet<Ticket[]>('/tickets', signal);

/** El back responde el ticket ya creado, asi que no hay que recargar la lista. */
export const createTicket = (input: CreateTicketInput): Promise<Ticket> =>
  apiSend<Ticket>('/tickets', 'POST', input);

/**
 * El back valida la transicion y devuelve el ticket ya movido de estado, asi que
 * la lista se actualiza sin recargarla.
 */
export const changeTicketStatus = (
  id: string,
  status: TicketStatus,
): Promise<Ticket> => apiSend<Ticket>(`/tickets/${id}`, 'PATCH', { status });