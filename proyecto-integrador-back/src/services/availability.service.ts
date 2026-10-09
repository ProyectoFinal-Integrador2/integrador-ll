import {
  disponibilidadRepositorio,
  type DisponibilidadRepositorio,
} from '../repositories/availability.repository';
import { HttpError } from '../utils/httpError';
import type { SesionUsuario } from '../types/auth.types';
import type {
  CrearDisponibilidadInput,
  DisponibilidadTecnico,
} from '../types/availability.types';

const MAX_LONGITUD_HORARIO = 60;

export class DisponibilidadServicio {
  constructor(private readonly repositorio: DisponibilidadRepositorio) {}

  async listar(): Promise<DisponibilidadTecnico[]> {
    return this.repositorio.listar();
  }

  /**
   * Registra o reemplaza el horario de un tecnico.
   *
   * El Jefe TI puede asignar el horario de cualquiera; un tecnico solo puede
   * registrar el suyo, para que nadie edite el turno de otro.
   */
  async crearActualizar(
    input: CrearDisponibilidadInput,
    sesion?: SesionUsuario,
  ): Promise<{ tecnicoId: string; horario: string }> {
    const tecnicoId = input.tecnicoId?.trim() ?? '';
    const horario = input.horario?.trim() ?? '';

    if (tecnicoId.length === 0) {
      throw HttpError.badRequest('Debes indicar el tecnico.');
    }

    if (horario.length === 0) {
      throw HttpError.badRequest('El horario es obligatorio.');
    }

    if (horario.length > MAX_LONGITUD_HORARIO) {
      throw HttpError.badRequest(
        `El horario no puede superar ${MAX_LONGITUD_HORARIO} caracteres.`,
      );
    }

    if (!sesion?.id) {
      throw HttpError.unauthorized('Sesion no iniciada.');
    }

    if (sesion.rol === 'Técnico' && tecnicoId !== sesion.id) {
      throw HttpError.forbidden('Solo puedes registrar tu propia disponibilidad.');
    }

    const registrado = await this.repositorio.crearActualizar(tecnicoId, horario);

    if (!registrado) {
      throw new Error('No se pudo registrar la disponibilidad.');
    }

    return { tecnicoId, horario };
  }
}

export const disponibilidadServicio = new DisponibilidadServicio(disponibilidadRepositorio);