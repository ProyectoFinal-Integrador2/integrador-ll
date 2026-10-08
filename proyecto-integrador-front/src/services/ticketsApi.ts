import { apiGet, apiSend } from './apiClient';
import type { CrearTicketInput, Ticket, EstadoTicket } from '../types/ticket.types';

export const obtenerTickets = (signal?: AbortSignal): Promise<Ticket[]> =>
  apiGet<Ticket[]>('/tickets', signal);

export const crearTicket = (input: CrearTicketInput): Promise<Ticket> =>
  apiSend<Ticket>('/tickets', 'POST', input);

export const cambiarEstadoTicket = (
  id: string,
  estado: EstadoTicket,
): Promise<Ticket> => apiSend<Ticket>(`/tickets/${id}`, 'PATCH', { estado });