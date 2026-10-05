import type { Request, Response } from 'express';
import { equipmentService } from '../services/equipment.service';
import { HttpError } from '../utils/httpError';
import type {
  CreateEquipmentInput,
  UpdateEquipmentInput,
} from '../types/equipment.types';

export class EquipmentController {
  /** GET /api/v1/equipments */
  static async list(_req: Request, res: Response): Promise<void> {
    const equipments = await equipmentService.list();
    res.json(equipments);
  }

  /** POST /api/v1/equipments */
  static async create(req: Request, res: Response): Promise<void> {
    // Express 5 encamina las promesas rechazadas al errorHandler, asi que
    // los HttpError del service llegan aqui sin try/catch.
    const equipment = await equipmentService.create(
      req.body as Partial<CreateEquipmentInput>,
    );
    res.status(201).json(equipment);
  }

  /** PUT /api/v1/equipments/:id */
  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    // Express 5 tipa los params como string | string[]. El patron de la ruta
    // es un solo segmento, asi que un array solo puede venir de una entrada
    // mal formada y no hay un id que buscar.
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