import type {
  CreateTicketInput,
  Ticket,
  TicketStatus,
} from '../types/ticket.types';
import { TICKET_SEED } from './tickets.seed';
import { userRepository, type UserRepository } from './user.repository';
import type { User } from '../types/user.types';

export interface TicketRepository {
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  create(input: CreateTicketInput): Promise<Ticket>;
  updateStatus(id: string, status: TicketStatus): Promise<Ticket | null>;
}

/**
 * Implementacion en memoria. Los barrels dejan escrito que esta capa es el
 * unico punto que habla con la base de datos: cuando exista, se agrega una
 * `SupabaseTicketRepository` con la misma interfaz y los services y
 * controllers no se tocan.
 *
 * Los tickets guardan `technicianId`, no el nombre. El nombre se resuelve al
 * leer, igual que hacen las evaluaciones y la disponibilidad: si un tecnico
 * cambia de nombre no hay que reescribir los tickets.
 */
export class InMemoryTicketRepository implements TicketRepository {
  private readonly tickets: Ticket[] = [...TICKET_SEED];

  constructor(private readonly users: UserRepository = userRepository) {}

  async findAll(): Promise<Ticket[]> {
    const users = await this.users.findAll();
    return this.tickets.map((ticket) => this.withTechnician(ticket, users));
  }

  async findById(id: string): Promise<Ticket | null> {
    const ticket = this.tickets.find((candidate) => candidate.id === id);
    if (!ticket) return null;

    return this.withTechnician(ticket, await this.users.findAll());
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const ticket: Ticket = {
      id: this.nextId(),
      description: input.description,
      user: input.user,
      userId: input.userId ?? null,
      priority: input.priority,
      status: 'Abierto',
      technicianId: null,
      technicianName: null,
      createdAt: new Date().toISOString(),
    };

    this.tickets.push(ticket);
    return ticket;
  }

  /**
   * `null` si no existe el id. La validacion de la transicion es del service:
   * el repositorio solo escribe.
   */
  async updateStatus(id: string, status: TicketStatus): Promise<Ticket | null> {
    const ticket = this.tickets.find((candidate) => candidate.id === id);

    if (!ticket) return null;

    ticket.status = status;
    return this.withTechnician(ticket, await this.users.findAll());
  }

  /** Sin tecnico asignado el nombre es `null`, no una cadena vacia. */
  private withTechnician(ticket: Ticket, users: User[]): Ticket {
    if (ticket.technicianId === null) return ticket;

    return {
      ...ticket,
      technicianName:
        users.find((user) => user.id === ticket.technicianId)?.name ?? null,
    };
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