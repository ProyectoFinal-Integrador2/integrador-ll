import type { Request, Response } from 'express';
import { disponibilidadServicio } from '../services/availability.service';

export class DisponibilidadControlador {
  static async listar(_req: Request, res: Response): Promise<void> {
    const tecnicos = await disponibilidadServicio.listar();
    res.json(tecnicos);
  }
}