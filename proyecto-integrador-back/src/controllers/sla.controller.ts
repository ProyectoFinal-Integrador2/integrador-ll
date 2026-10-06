import type { Request, Response } from 'express';
import { slaService } from '../services/sla.service';
import { HttpError } from '../utils/httpError';
import type { CreateSlaPriorityInput, UpdateSlaPriorityInput } from '../types/sla.types';

export class SlaController {
  static async list(_req: Request, res: Response): Promise<void> {
    const priorities = await slaService.list();
    res.json(priorities);
  }

  static async create(req: Request, res: Response): Promise<void> {
     const priority = await slaService.create(
      req.body as Partial<CreateSlaPriorityInput>,
    );
    res.status(201).json(priority);
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

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