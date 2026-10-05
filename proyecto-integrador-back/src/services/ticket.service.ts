import {
  ticketRepository,
  type TicketRepository,
} from '../repositories/ticket.repository';
import { HttpError } from '../utils/httpError';
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  TICKET_STATUS_TRANSITIONS,
  type CreateTicketInput,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
  type UpdateTicketStatusInput,
} from '../types/ticket.types';

const MIN_DESCRIPTION_LENGTH = 10;

/** El body viene de `req.body`, o sea `any`: aqui se acota al dominio. */
type UntrustedTicketInput = Partial<CreateTicketInput>;

type UntrustedStatusInput = Partial<UpdateTicketStatusInput>;

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

    /**
     * El id del solicitante es opcional: el Jefe TI puede abrir un ticket a
     * nombre de alguien escribiendo su nombre, y en ese caso no hay id que
     * guardar. Quien se registra desde la sesion si lo manda. No se valida que
     * exista, porque lo que lo garantiza va a ser la llave foranea; hoy el
     * filtro "mis tickets" simplemente no lo encuentra si el id no corresponde.
     */
    const userId = input.userId?.trim();

    return this.repository.create({
      description,
      user,
      userId: userId && userId.length > 0 ? userId : undefined,
      priority: priority as TicketPriority,
    });
  }

  /**
   * Mueve el ticket a `status`. El service es quien valida la transicion para
   * que ningun endpoint pueda saltarse el ciclo del soporte.
   *
   * Ojo: todavia no se valida el rol de quien llama. Es la misma limitacion que
   * en el resto del modulo: sin autenticacion, cualquiera que conozca la API
   * podria culminar un ticket. Cuando exista auth, el rol del tecnico se valida
   * aqui.
   */
  async changeStatus(id: string, input: UntrustedStatusInput): Promise<Ticket> {
    const ticket = await this.repository.findById(id);

    if (!ticket) {
      throw HttpError.notFound('Ticket no encontrado.');
    }

    const status = input.status;

    if (!status || !TICKET_STATUSES.includes(status)) {
      throw HttpError.badRequest('El estado no es valido.');
    }

    const allowed = TICKET_STATUS_TRANSITIONS[ticket.status];

    if (!allowed.includes(status as TicketStatus)) {
      throw HttpError.badRequest(
        allowed.length === 0
          ? `El ticket ya esta ${ticket.status.toLowerCase()}: no admite mas cambios de estado.`
          : `Un ticket en estado "${ticket.status}" solo puede pasar a ${allowed
              .map((next) => `"${next}"`)
              .join(' o ')}.`,
      );
    }

    const updated = await this.repository.updateStatus(id, status as TicketStatus);

    if (!updated) {
      // Solo posible si el ticket desaparece entre findById y updateStatus.
      throw HttpError.notFound('Ticket no encontrado.');
    }

    return updated;
  }
}

export const ticketService = new TicketService(ticketRepository);
