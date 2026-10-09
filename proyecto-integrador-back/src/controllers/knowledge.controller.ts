import type { Request, Response } from 'express';
import { conocimientoServicio } from '../services/knowledge.service';
import type { CrearArticuloInput } from '../types/knowledge.types';

export class ConocimientoControlador {
  static async listar(_req: Request, res: Response): Promise<void> {
    const articulos = await conocimientoServicio.listar();
    res.json(articulos);
  }

  static async crear(req: Request, res: Response): Promise<void> {
    const articulo = await conocimientoServicio.crear(
      req.body as Partial<CrearArticuloInput>,
      req.sesion,
    );
    res.status(201).json(articulo);
  }
}