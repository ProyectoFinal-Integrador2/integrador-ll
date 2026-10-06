import type { Request, Response } from 'express';
import { reportService } from '../services/report.service';

export class ReportController {
  static async summary(_req: Request, res: Response): Promise<void> {
    const report = await reportService.summary();
    res.json(report);
  }
}