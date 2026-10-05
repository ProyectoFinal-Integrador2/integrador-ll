import type {
  TechnicianAvailability,
  TechnicianStatus,
} from '../types/availability.types';
import { AVAILABILITY_SEED, SIN_HORARIO } from './availability.seed';
import {
  userRepository,
  type UserRepository,
} from './user.repository';

export interface AvailabilityRepository {
  findAll(): Promise<TechnicianAvailability[]>;
}

/**
 * Compone la disponibilidad a partir de los usuarios con rol 'Tecnico'.
 *
 * La alternativa —una lista de tecnicos propia— obliga a mantener el nombre y
 * el avatar en dos lugares: en cuanto se corrige un usuario en la pantalla de
 * Usuarios, la tarjeta de disponibilidad sigue mostrando el nombre viejo.
 */
export class TechnicianAvailabilityRepository
  implements AvailabilityRepository
{
  constructor(private readonly users: UserRepository = userRepository) {}

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
          // Sin registro de disponibilidad se asume Libre, que es el estado en
          // el que un tecnico sin agenda puede realmente estar.
          status: (record?.status ?? 'Libre') as TechnicianStatus,
        };
      })
      // Por nombre y no por id: el tablero se lee siempre alfabeticamente.
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }
}

export const availabilityRepository = new TechnicianAvailabilityRepository();