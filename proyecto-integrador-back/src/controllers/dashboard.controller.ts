import type { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {

  static async summary(req: Request, res: Response): Promise<void> {
    const { technicianId, userId } = req.query;

    const read = (value: unknown): string | undefined =>
      typeof value === 'string' && value.length > 0 ? value : undefined;

    const report = await dashboardService.summary(read(technicianId), read(userId));

    res.json(report);
  }
}