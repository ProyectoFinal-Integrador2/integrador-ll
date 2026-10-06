import type { TechnicianAvailability, TechnicianStatus } from '../types/availability.types';
import { AVAILABILITY_SEED, SIN_HORARIO } from '../seeds/availability.seed';
import { userRepository, type UserRepository } from './user.repository';

export interface AvailabilityRepository {
  findAll(): Promise<TechnicianAvailability[]>;
}

export class TechnicianAvailabilityRepository
  implements AvailabilityRepository {
  constructor(private readonly users: UserRepository = userRepository) { }

  async findAll(): Promise<TechnicianAvailability[]> {
    const users = await this.users.findAll();

    const byUserId = new Map(
      AVAILABILITY_SEED.map((record) => [record.userId, record]),
    );

    return users
      .filter((user) => user.role === 'Técnico' && user.status === 'Activo')
      .map((user) => {
        const record = byUserId.get(user.id);

        return {
          id: user.id,
          name: user.name,
          avatarInitials: user.avatarInitials,
          avatarColor: user.avatarColor,
          schedule: record?.schedule ?? SIN_HORARIO,
          activeTickets: record?.activeTickets ?? 0,
          status: (record?.status ?? 'Libre') as TechnicianStatus,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }
}

export const availabilityRepository = new TechnicianAvailabilityRepository();