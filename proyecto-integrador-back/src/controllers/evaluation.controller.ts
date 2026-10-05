import type { Request, Response } from 'express';
import { evaluationService } from '../services/evaluation.service';
import { HttpError } from '../utils/httpError';
import type { CreateEvaluationInput } from '../types/evaluation.types';

export class EvaluationController {
  /** GET /api/v1/evaluations */
  static async list(_req: Request, res: Response): Promise<void> {
    const evaluations = await evaluationService.list();
    res.json(evaluations);
  }

  /**
   * GET /api/v1/evaluations/pending?userId=4
   *
   * Los tickets cerrados del solicitante que todavia no califico. El `userId`
   * es un filtro, no una autorizacion: ver la nota de `DashboardService.summary`.
   */
  static async listPending(req: Request, res: Response): Promise<void> {
    const { userId } = req.query;

    if (typeof userId !== 'string' || userId.length === 0) {
      throw HttpError.badRequest('El userId es obligatorio.');
    }

    res.json(await evaluationService.listPending(userId));
  }

  /** POST /api/v1/evaluations */
  static async create(req: Request, res: Response): Promise<void> {
    const evaluation = await evaluationService.create(
      req.body as Partial<CreateEvaluationInput>,
    );

    res.status(201).json(evaluation);
  }
}