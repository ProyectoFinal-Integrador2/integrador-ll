import {
  availabilityRepository,
  type AvailabilityRepository,
} from '../repositories/availability.repository';
import type { TechnicianAvailability } from '../types/availability.types';

export class AvailabilityService {
  constructor(private readonly repository: AvailabilityRepository) {}

  /**
   * Solo lectura por ahora: no hay modulo de turnos todavia, asi que no hay
   * nada que validar. El service existe para que el endpoint no lea directo del
   * repository, como los demas.
   */
  async list(): Promise<TechnicianAvailability[]> {
    return this.repository.findAll();
  }
}

export const availabilityService = new AvailabilityService(availabilityRepository);