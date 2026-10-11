import type { Request, Response } from 'express';
import { disponibilidadServicio } from '../services/availability.service';
import type { CrearDisponibilidadInput } from '../types/availability.types';

export class DisponibilidadControlador {
  static async listar(_req: Request, res: Response): Promise<void> {
    const tecnicos = await disponibilidadServicio.listar();
    res.json(tecnicos);
  }

  static async crearActualizar(req: Request, res: Response): Promise<void> {
    const resultado = await disponibilidadServicio.crearActualizar(
      req.body as CrearDisponibilidadInput,
      req.sesion,
    );
    res.status(201).json(resultado);
  }
}