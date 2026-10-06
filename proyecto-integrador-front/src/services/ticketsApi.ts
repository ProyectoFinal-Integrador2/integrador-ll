import { apiGet, apiSend } from './apiClient';
import type { CreateTicketInput, Ticket, TicketStatus} from '../types/ticket.types';

export const fetchTickets = (signal?: AbortSignal): Promise<Ticket[]> =>
  apiGet<Ticket[]>('/tickets', signal);

export const createTicket = (input: CreateTicketInput): Promise<Ticket> =>
  apiSend<Ticket>('/tickets', 'POST', input);

export const changeTicketStatus = (
  id: string,
  status: TicketStatus,
): Promise<Ticket> => apiSend<Ticket>(`/tickets/${id}`, 'PATCH', { status });