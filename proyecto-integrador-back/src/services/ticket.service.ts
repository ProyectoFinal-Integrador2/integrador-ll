import {
  ticketRepository,
  type TicketRepository,
} from '../repositories/ticket.repository';
import { HttpError } from '../utils/httpError';
import {
  TICKET_PRIORITIES,
  type CreateTicketInput,
  type Ticket,
  type TicketPriority,
} from '../types/ticket.types';

const MIN_DESCRIPTION_LENGTH = 10;

/** El body viene de `req.body`, o sea `any`: aqui se acota al dominio. */
type UntrustedTicketInput = Partial<CreateTicketInput>;

export class TicketService {
  constructor(private readonly repository: TicketRepository) {}

  async list(): Promise<Ticket[]> {
    const tickets = await this.repository.findAll();
    return [...tickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async create(input: UntrustedTicketInput): Promise<Ticket> {
    const description = input.description?.trim() ?? '';

    if (description.length < MIN_DESCRIPTION_LENGTH) {
      throw HttpError.badRequest(
        `La descripcion debe tener al menos ${MIN_DESCRIPTION_LENGTH} caracteres.`,
      );
    }

    const user = input.user?.trim() ?? '';

    if (user.length === 0) {
      throw HttpError.badRequest('El usuario es obligatorio.');
    }

    const priority = input.priority;

    if (!priority || !TICKET_PRIORITIES.includes(priority)) {
      throw HttpError.badRequest('La prioridad no es valida.');
    }

    return this.repository.create({
      description,
      user,
      priority: priority as TicketPriority,
    });
  }
}

export const ticketService = new TicketService(ticketRepository);
