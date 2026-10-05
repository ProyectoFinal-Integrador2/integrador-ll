import type {
  CreateSlaPriorityInput,
  SlaLevel,
  SlaPriority,
  UpdateSlaPriorityInput,
} from '../types/sla.types';
import { SLA_SEED } from './sla.seed';

export interface SlaRepository {
  findAll(): Promise<SlaPriority[]>;
  findById(id: string): Promise<SlaPriority | undefined>;
  create(input: CreateSlaPriorityInput): Promise<SlaPriority>;
  update(
    id: string,
    input: UpdateSlaPriorityInput,
  ): Promise<SlaPriority | undefined>;
}

/**
 * Implementacion en memoria. Esta capa es el unico punto que habla con la
 * base de datos: cuando exista, se agrega una `SupabaseSlaRepository` con la
 * misma interfaz y los services y controllers no se tocan.
 */
export class InMemorySlaRepository implements SlaRepository {
  private readonly priorities: SlaPriority[] = [...SLA_SEED];

  async findAll(): Promise<SlaPriority[]> {
    return [...this.priorities];
  }

  async findById(id: string): Promise<SlaPriority | undefined> {
    return this.priorities.find((priority) => priority.id === id);
  }

  async create(input: CreateSlaPriorityInput): Promise<SlaPriority> {
    const priority: SlaPriority = {
      id: this.nextId(),
      level: input.level,
      description: input.description,
      responseMinutes: input.responseMinutes,
      resolutionMinutes: input.resolutionMinutes,
      escalationMinutes: input.escalationMinutes,
      updatedAt: new Date().toISOString(),
    };

    this.priorities.push(priority);
    return priority;
  }

  async update(
    id: string,
    input: UpdateSlaPriorityInput,
  ): Promise<SlaPriority | undefined> {
    const index = this.priorities.findIndex((priority) => priority.id === id);
    if (index === -1) return undefined;

    // Se reconstruye para no mutar campos sueltos. `updatedAt` lo cambia el
    // dominio en cada edicion: es cuando se retocaron los tiempos.
    const updated: SlaPriority = {
      ...this.priorities[index],
      level: input.level,
      description: input.description,
      responseMinutes: input.responseMinutes,
      resolutionMinutes: input.resolutionMinutes,
      escalationMinutes: input.escalationMinutes,
      updatedAt: new Date().toISOString(),
    };

    this.priorities[index] = updated;
    return updated;
  }

  /** Los ids del seed son correlativos, asi que basta con el maximo + 1. */
  private nextId(): string {
    const max = this.priorities.reduce((acc, priority) => {
      const value = Number(priority.id);
      return Number.isInteger(value) && value > acc ? value : acc;
    }, 0);

    return String(max + 1);
  }
}

export const slaRepository = new InMemorySlaRepository();