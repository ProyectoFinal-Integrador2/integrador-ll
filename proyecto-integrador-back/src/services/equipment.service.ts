import {
  equipmentRepository,
  type EquipmentRepository,
} from '../repositories/equipment.repository';
import { HttpError } from '../utils/httpError';
import {
  EQUIPMENT_STATUSES,
  EQUIPMENT_TYPES,
  type CreateEquipmentInput,
  type Equipment,
  type EquipmentStatus,
  type EquipmentType,
  type UpdateEquipmentInput,
} from '../types/equipment.types';

/** Codigo de inventario: dos o tres letras, guion y al menos un digito. */
const CODE_PATTERN = /^[A-Za-z]{2,3}-\d{1,4}$/;

/** El body viene de `req.body`, o sea `any`: aqui se acota al dominio. */
type UntrustedEquipmentInput = Partial<CreateEquipmentInput & UpdateEquipmentInput>;

export class EquipmentService {
  constructor(private readonly repository: EquipmentRepository) {}

  async list(): Promise<Equipment[]> {
    const equipments = await this.repository.findAll();
    return [...equipments].sort((a, b) => a.code.localeCompare(b.code));
  }

  async create(input: UntrustedEquipmentInput): Promise<Equipment> {
    const code = this.requireCode(input.code);

    await this.assertCodeIsFree(code);

    return this.repository.create({
      code,
      name: this.requireName(input.name),
      area: this.requireArea(input.area),
      type: this.requireType(input.type),
    });
  }

  async update(id: string, input: UntrustedEquipmentInput): Promise<Equipment> {
    const current = await this.repository.findById(id);

    if (!current) {
      throw HttpError.notFound(`No existe un equipo con id ${id}.`);
    }

    const code = this.requireCode(input.code);

    // El codigo es la identidad: no puede repetir, salvo sobre el propio
    // equipo que se esta editando.
    await this.assertCodeIsFree(code, id);

    const updated = await this.repository.update(id, {
      code,
      name: this.requireName(input.name),
      area: this.requireArea(input.area),
      type: this.requireType(input.type),
      status: this.requireStatus(input.status),
    });

    if (!updated) {
      throw HttpError.notFound(`No existe un equipo con id ${id}.`);
    }

    return updated;
  }

  private requireName(value: string | undefined): string {
    const name = value?.trim() ?? '';

    if (name.length < 3) {
      throw HttpError.badRequest('El nombre debe tener al menos 3 caracteres.');
    }

    return name;
  }

  private requireArea(value: string | undefined): string {
    const area = value?.trim() ?? '';

    if (area.length === 0) {
      throw HttpError.badRequest('El area es obligatoria.');
    }

    return area;
  }

  /** El codigo se guarda en mayusculas para que LT-01 y lt-01 no coexistiendo. */
  private requireCode(value: string | undefined): string {
    const code = value?.trim().toUpperCase() ?? '';

    if (!CODE_PATTERN.test(code)) {
      throw HttpError.badRequest(
        'El codigo debe tener el formato XY-000 (ej. LT-014).',
      );
    }

    return code;
  }

  private requireType(value: EquipmentType | undefined): EquipmentType {
    if (!value || !EQUIPMENT_TYPES.includes(value)) {
      throw HttpError.badRequest('El tipo de equipo no es valido.');
    }

    return value;
  }

  private requireStatus(value: EquipmentStatus | undefined): EquipmentStatus {
    if (!value || !EQUIPMENT_STATUSES.includes(value)) {
      throw HttpError.badRequest('El estado no es valido.');
    }

    return value;
  }

  /** Lanza 409 si el codigo ya pertenece a otro equipo. */
  private async assertCodeIsFree(code: string, exceptId?: string): Promise<void> {
    const equipments = await this.repository.findAll();
    const taken = equipments.some(
      (equipment) => equipment.code === code && equipment.id !== exceptId,
    );

    if (taken) {
      throw new HttpError(409, 'Ya existe un equipo con ese codigo.');
    }
  }
}

export const equipmentService = new EquipmentService(equipmentRepository);