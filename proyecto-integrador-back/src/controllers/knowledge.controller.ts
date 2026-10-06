import type { Request, Response } from 'express';
import { knowledgeService } from '../services/knowledge.service';

export class KnowledgeController {
  static async list(_req: Request, res: Response): Promise<void> {
    const articles = await knowledgeService.list();
    res.json(articles);
  }
}