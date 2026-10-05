import type { CreateTicketInput, Ticket } from '../types/ticket.types';
import { TICKET_SEED } from './tickets.seed';

export interface TicketRepository {
  findAll(): Promise<Ticket[]>;
  create(input: CreateTicketInput): Promise<Ticket>;
}

/**
 * Implementacion en memoria. Los barrels dejan escrito que esta capa es el
 * unico punto que habla con la base de datos: cuando exista, se agrega una
 * `SupabaseTicketRepository` con la misma interfaz y los services y
 * controllers no se tocan.
 */
export class InMemoryTicketRepository implements TicketRepository {
  private readonly tickets: Ticket[] = [...TICKET_SEED];

  async findAll(): Promise<Ticket[]> {
    return [...this.tickets];
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const ticket: Ticket = {
      id: this.nextId(),
      description: input.description,
      user: input.user,
      priority: input.priority,
      status: 'Abierto',
      createdAt: new Date().toISOString(),
    };

    this.tickets.push(ticket);
    return ticket;
  }

  /** Los ids del seed son correlativos, asi que basta con el maximo + 1. */
  private nextId(): string {
    const max = this.tickets.reduce((acc, ticket) => {
      const value = Number(ticket.id);
      return Number.isInteger(value) && value > acc ? value : acc;
    }, 0);

    return String(max + 1);
  }
}

export const ticketRepository = new InMemoryTicketRepository();
