import type {
  CreateEquipmentInput,
  Equipment,
  UpdateEquipmentInput,
} from '../types/equipment.types';
import { EQUIPMENT_SEED } from './equipments.seed';

export interface EquipmentRepository {
  findAll(): Promise<Equipment[]>;
  findById(id: string): Promise<Equipment | undefined>;
  create(input: CreateEquipmentInput): Promise<Equipment>;
  update(id: string, input: UpdateEquipmentInput): Promise<Equipment | undefined>;
}

/**
 * Implementacion en memoria. Esta capa es el unico punto que habla con la
 * base de datos: cuando exista, se agrega una `SupabaseEquipmentRepository` con
 * la misma interfaz y los services y controllers no se tocan.
 */
export class InMemoryEquipmentRepository implements EquipmentRepository {
  private readonly equipments: Equipment[] = [...EQUIPMENT_SEED];

  async findAll(): Promise<Equipment[]> {
    return [...this.equipments];
  }

  async findById(id: string): Promise<Equipment | undefined> {
    return this.equipments.find((equipment) => equipment.id === id);
  }

  async create(input: CreateEquipmentInput): Promise<Equipment> {
    const equipment: Equipment = {
      id: this.nextId(),
      code: input.code,
      name: input.name,
      area: input.area,
      type: input.type,
      status: 'Operativo',
      registeredAt: new Date().toISOString(),
    };

    this.equipments.push(equipment);
    return equipment;
  }

  async update(
    id: string,
    input: UpdateEquipmentInput,
  ): Promise<Equipment | undefined> {
    const index = this.equipments.findIndex((equipment) => equipment.id === id);
    if (index === -1) return undefined;

    // Se reconstruye el equipo para no mutar campos sueltos. `registeredAt` se
    // conserva: es la fecha de alta del inventario, no de la ultima edicion.
    const updated: Equipment = {
      ...this.equipments[index],
      code: input.code,
      name: input.name,
      area: input.area,
      type: input.type,
      status: input.status,
    };

    this.equipments[index] = updated;
    return updated;
  }

  /** Los ids del seed son correlativos, asi que basta con el maximo + 1. */
  private nextId(): string {
    const max = this.equipments.reduce((acc, equipment) => {
      const value = Number(equipment.id);
      return Number.isInteger(value) && value > acc ? value : acc;
    }, 0);

    return String(max + 1);
  }
}

export const equipmentRepository = new InMemoryEquipmentRepository();