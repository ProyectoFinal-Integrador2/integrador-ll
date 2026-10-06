import type { Request, Response } from 'express';
import { evaluationService } from '../services/evaluation.service';
import { HttpError } from '../utils/httpError';
import type { CreateEvaluationInput } from '../types/evaluation.types';

export class EvaluationController {
  static async list(_req: Request, res: Response): Promise<void> {
    const evaluations = await evaluationService.list();
    res.json(evaluations);
  }

  static async listPending(req: Request, res: Response): Promise<void> {
    const { userId } = req.query;

    if (typeof userId !== 'string' || userId.length === 0) {
      throw HttpError.badRequest('El userId es obligatorio.');
    }

    res.json(await evaluationService.listPending(userId));
  }

  static async create(req: Request, res: Response): Promise<void> {
    const evaluation = await evaluationService.create(
      req.body as Partial<CreateEvaluationInput>,
    );

    res.status(201).json(evaluation);
  }
}