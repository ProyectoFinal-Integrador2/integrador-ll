import type { Request, Response } from 'express';
import { evaluacionServicio } from '../services/evaluation.service';
import { HttpError } from '../utils/httpError';
import type { CrearEvaluacionInput } from '../types/evaluation.types';

export class EvaluacionControlador {
  static async listar(_req: Request, res: Response): Promise<void> {
    const evaluaciones = await evaluacionServicio.listar();
    res.json(evaluaciones);
  }

  static async listarPendientes(req: Request, res: Response): Promise<void> {
    const { usuarioId } = req.query;

    if (typeof usuarioId !== 'string' || usuarioId.length === 0) {
      throw HttpError.badRequest('El usuarioId es obligatorio.');
    }

    if (req.sesion?.rol === 'Usuario' && usuarioId !== req.sesion.id) {
      throw HttpError.forbidden('Solo puedes consultar tus propias evaluaciones.');
    }

    res.json(await evaluacionServicio.listarPendientes(usuarioId));
  }

  static async crear(req: Request, res: Response): Promise<void> {
    const evaluacion = await evaluacionServicio.crear(
      req.body as Partial<CrearEvaluacionInput>,
    );

    res.status(201).json(evaluacion);
  }
}