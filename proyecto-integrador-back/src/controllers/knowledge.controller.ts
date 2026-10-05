import type { Request, Response } from 'express';
import { knowledgeService } from '../services/knowledge.service';

export class KnowledgeController {
  /** GET /api/v1/knowledge-base */
  static async list(_req: Request, res: Response): Promise<void> {
    const articles = await knowledgeService.list();
    res.json(articles);
  }
}