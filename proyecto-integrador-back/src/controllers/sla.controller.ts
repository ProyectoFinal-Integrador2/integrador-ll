import type { Request, Response } from 'express';
import { slaServicio } from '../services/sla.service';
import { HttpError } from '../utils/httpError';
import type { CrearSlaPrioridadInput, ActualizarSlaPrioridadInput } from '../types/sla.types';

export class SlaControlador {
  static async listar(_req: Request, res: Response): Promise<void> {
    const prioridades = await slaServicio.listar();
    res.json(prioridades);
  }

  static async crear(req: Request, res: Response): Promise<void> {
    const prioridad = await slaServicio.crear(
      req.body as Partial<CrearSlaPrioridadInput>,
    );
    res.status(201).json(prioridad);
  }

  static async actualizar(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (typeof id !== 'string') {
      throw HttpError.badRequest('El id de la prioridad SLA no es valido.');
    }

    const prioridad = await slaServicio.actualizar(
      id,
      req.body as Partial<ActualizarSlaPrioridadInput>,
    );
    res.json(prioridad);
  }
}