import type { Request, Response } from 'express';
import { conocimientoServicio } from '../services/knowledge.service';

export class ConocimientoControlador {
  static async listar(_req: Request, res: Response): Promise<void> {
    const articulos = await conocimientoServicio.listar();
    res.json(articulos);
  }
}