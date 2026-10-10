import type { Request, Response } from 'express';
import { equipoServicio } from '../services/equipment.service';
import { HttpError } from '../utils/httpError';
import type {
  CrearEquipoInput,
  ActualizarEquipoInput,
} from '../types/equipment.types';

export class EquipoControlador {
  static async listar(_req: Request, res: Response): Promise<void> {
    const equipos = await equipoServicio.listar();
    res.json(equipos);
  }

  static async crear(req: Request, res: Response): Promise<void> {
    const equipo = await equipoServicio.crear(
      req.body as Partial<CrearEquipoInput>,
    );
    res.status(201).json(equipo);
  }

  static async actualizar(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (typeof id !== 'string') {
      throw HttpError.badRequest('El id del equipo no es valido.');
    }

    const equipo = await equipoServicio.actualizar(
      id,
      req.body as Partial<ActualizarEquipoInput>,
    );
    res.json(equipo);
  }
}