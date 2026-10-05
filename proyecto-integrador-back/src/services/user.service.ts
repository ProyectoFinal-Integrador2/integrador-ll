import { userRepository, type UserRepository } from '../repositories/user.repository';
import { HttpError } from '../utils/httpError';
import {
  USER_ROLES,
  type CreateUserInput,
  type UpdateUserInput,
  type User,
  type UserRole,
  type UserStatus,
} from '../types/user.types';

/** Acepta lo que el navegador acepta, sinxes: exige parte local y arroba. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** El body viene de `req.body`, o sea `any`: aqui se acota al dominio. */
type UntrustedUserInput = Partial<CreateUserInput & UpdateUserInput>;

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async list(): Promise<User[]> {
    const users = await this.repository.findAll();
    return [...users].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }

  async create(input: UntrustedUserInput): Promise<User> {
    const name = this.requireName(input.name);
    const email = this.requireEmail(input.email);
    const role = this.requireRole(input.role);

    await this.assertEmailIsFree(email);

    return this.repository.create({
      name,
      email,
      role,
      area: this.requireArea(input.area),
    });
  }

  async update(id: string, input: UntrustedUserInput): Promise<User> {
    const current = await this.repository.findById(id);

    if (!current) {
      throw HttpError.notFound(`No existe un usuario con id ${id}.`);
    }

    const name = this.requireName(input.name);
    const email = this.requireEmail(input.email);

    // El correo es la identidad: no puede repetir, salvo sobre el propio
    // usuario que se esta editando.
    await this.assertEmailIsFree(email, id);

    const updated = await this.repository.update(id, {
      name,
      email,
      role: this.requireRole(input.role),
      status: this.requireStatus(input.status),
    });

    if (!updated) {
      throw HttpError.notFound(`No existe un usuario con id ${id}.`);
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

  private requireEmail(value: string | undefined): string {
    const email = value?.trim().toLowerCase() ?? '';

    if (!EMAIL_PATTERN.test(email)) {
      throw HttpError.badRequest('El correo no tiene un formato valido.');
    }

    return email;
  }

  private requireRole(value: UserRole | undefined): UserRole {
    if (!value || !USER_ROLES.includes(value)) {
      throw HttpError.badRequest('El rol no es valido.');
    }

    return value;
  }

  private requireStatus(value: UserStatus | undefined): UserStatus {
    if (value !== 'Activo' && value !== 'Inactivo') {
      throw HttpError.badRequest('El estado no es valido.');
    }

    return value;
  }

  /** Lanza 409 si el correo ya pertenece a otro usuario. */
  private async assertEmailIsFree(email: string, exceptId?: string): Promise<void> {
    const users = await this.repository.findAll();
    const taken = users.some(
      (user) => user.email === email && user.id !== exceptId,
    );

    if (taken) {
      throw new HttpError(409, 'Ya existe un usuario con ese correo.');
    }
  }
}

export const userService = new UserService(userRepository);