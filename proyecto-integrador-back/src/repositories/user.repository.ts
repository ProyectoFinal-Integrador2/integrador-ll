import type { AvatarColor, CreateUserInput, UpdateUserInput, User,UserRole} from '../types/user.types';
import { USER_SEED } from '../seeds/users.seed';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User | undefined>;
}

/** Un color por rol, para que el avatar no dependa de datos guardados. */
const AVATAR_COLOR_BY_ROLE: Record<UserRole, AvatarColor> = {
  'Jefe TI': 'blue',
  'Técnico': 'green',
  'Usuario': 'amber',
};

export const initialsFromName = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export class InMemoryUserRepository implements UserRepository {
  private readonly users: User[] = [...USER_SEED];

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async create(input: CreateUserInput): Promise<User> {
    const user: User = {
      id: this.nextId(),
      name: input.name,
      email: input.email,
      role: input.role,
      area: input.area,
      status: 'Activo',
      avatarInitials: initialsFromName(input.name),
      avatarColor: AVATAR_COLOR_BY_ROLE[input.role],
    };

    this.users.push(user);
    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<User | undefined> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;
    const updated: User = {
      ...this.users[index],
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.status,
      avatarInitials: initialsFromName(input.name),
      avatarColor: AVATAR_COLOR_BY_ROLE[input.role],
    };

    this.users[index] = updated;
    return updated;
  }

  private nextId(): string {
    const max = this.users.reduce((acc, user) => {
      const value = Number(user.id);
      return Number.isInteger(value) && value > acc ? value : acc;
    }, 0);

    return String(max + 1);
  }
}

export const userRepository = new InMemoryUserRepository();