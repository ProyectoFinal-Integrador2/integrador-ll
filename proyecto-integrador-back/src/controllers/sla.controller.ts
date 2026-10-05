import type { Request, Response } from 'express';
import { slaService } from '../services/sla.service';
import { HttpError } from '../utils/httpError';
import type { CreateSlaPriorityInput, UpdateSlaPriorityInput } from '../types/sla.types';

export class SlaController {
  /** GET /api/v1/sla */
  static async list(_req: Request, res: Response): Promise<void> {
    const priorities = await slaService.list();
    res.json(priorities);
  }

  /** POST /api/v1/sla */
  static async create(req: Request, res: Response): Promise<void> {
    // Express 5 encamina las promesas rechazadas al errorHandler, asi que
    // los HttpError del service llegan aqui sin try/catch.
    const priority = await slaService.create(
      req.body as Partial<CreateSlaPriorityInput>,
    );
    res.status(201).json(priority);
  }

  /** PUT /api/v1/sla/:id */
  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    // Express 5 tipa los params como string | string[]. El patron de la ruta
    // es un solo segmento, asi que un array solo puede venir de una entrada
    // mal formada y no hay un id que buscar.
    if (typeof id !== 'string') {
      throw HttpError.badRequest('El id de la prioridad SLA no es valido.');
    }

    const priority = await slaService.update(
      id,
      req.body as Partial<UpdateSlaPriorityInput>,
    );
    res.json(priority);
  }
}