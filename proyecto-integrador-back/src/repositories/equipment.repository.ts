import type { CreateEquipmentInput, Equipment, UpdateEquipmentInput } from '../types/equipment.types';
import { EQUIPMENT_SEED } from '../seeds/equipments.seed';

export interface EquipmentRepository {
  findAll(): Promise<Equipment[]>;
  findById(id: string): Promise<Equipment | undefined>;
  create(input: CreateEquipmentInput): Promise<Equipment>;
  update(id: string, input: UpdateEquipmentInput): Promise<Equipment | undefined>;
}

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

  private nextId(): string {
    const max = this.equipments.reduce((acc, equipment) => {
      const value = Number(equipment.id);
      return Number.isInteger(value) && value > acc ? value : acc;
    }, 0);

    return String(max + 1);
  }
}

export const equipmentRepository = new InMemoryEquipmentRepository();