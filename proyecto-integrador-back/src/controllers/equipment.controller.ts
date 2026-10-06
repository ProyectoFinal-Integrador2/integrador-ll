import type { Request, Response } from 'express';
import { equipmentService } from '../services/equipment.service';
import { HttpError } from '../utils/httpError';
import type {
  CreateEquipmentInput,
  UpdateEquipmentInput,
} from '../types/equipment.types';

export class EquipmentController {
  static async list(_req: Request, res: Response): Promise<void> {
    const equipments = await equipmentService.list();
    res.json(equipments);
  }

  static async create(req: Request, res: Response): Promise<void> {
       const equipment = await equipmentService.create(
      req.body as Partial<CreateEquipmentInput>,
    );
    res.status(201).json(equipment);
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

       if (typeof id !== 'string') {
      throw HttpError.badRequest('El id del equipo no es valido.');
    }

    const equipment = await equipmentService.update(
      id,
      req.body as Partial<UpdateEquipmentInput>,
    );
    res.json(equipment);
  }
}