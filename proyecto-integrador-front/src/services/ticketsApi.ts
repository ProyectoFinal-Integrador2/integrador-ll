import type { CreateTicketInput, Ticket } from '../types/ticket.types';

/**
 * Rutas relativas a proposito: el proxy de Vite (/api -> localhost:3000) las
 * resuelve. Pegar http://localhost:3000 aqui saltaria el proxy y traeria CORS.
 */
const BASE_PATH = '/api/v1/tickets';

/** El back responde { error: string } en 4xx y 5xx. */
const readError = async (response: Response): Promise<string> => {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === 'object' &&
      body !== null &&
      'error' in body &&
      typeof body.error === 'string'
    ) {
      return body.error;
    }
  } catch {
    // Respuesta sin JSON: cae al mensaje generico.
  }
  return `Error ${response.status}`;
};

export const fetchTickets = async (signal?: AbortSignal): Promise<Ticket[]> => {
  const response = await fetch(BASE_PATH, { signal });

  if (!response.ok) throw new Error(await readError(response));

  return (await response.json()) as Ticket[];
};

export const createTicket = async (input: CreateTicketInput): Promise<Ticket> => {
  const response = await fetch(BASE_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error(await readError(response));

  return (await response.json()) as Ticket;
};
