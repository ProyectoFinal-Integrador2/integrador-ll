import {
  disponibilidadRepositorio,
  type DisponibilidadRepositorio,
} from '../repositories/availability.repository';
import type { DisponibilidadTecnico } from '../types/availability.types';

export class DisponibilidadServicio {
  constructor(private readonly repositorio: DisponibilidadRepositorio) {}

  /**
   * Solo lectura por ahora: no hay modulo de turnos todavia, asi que no hay
   * nada que validar. El service existe para que el endpoint no lea directo del
   * repositorio, como los demas.
   */
  async listar(): Promise<DisponibilidadTecnico[]> {
    return this.repositorio.listar();
  }
}

export const disponibilidadServicio = new DisponibilidadServicio(disponibilidadRepositorio);