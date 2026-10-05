import type { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {
  /**
   * GET /api/v1/dashboard
   * GET /api/v1/dashboard?technicianId=2
   * GET /api/v1/dashboard?userId=4
   *
   * Los query params son filtros, no autorizaciones: sin autenticacion no hay
   * forma de saber quien pregunta. Ver la nota de `DashboardService.summary`.
   */
  static async summary(req: Request, res: Response): Promise<void> {
    const { technicianId, userId } = req.query;

    const read = (value: unknown): string | undefined =>
      typeof value === 'string' && value.length > 0 ? value : undefined;

    const report = await dashboardService.summary(read(technicianId), read(userId));

    res.json(report);
  }
}