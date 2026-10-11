import type { Request, Response } from 'express';
import { dashboardServicio } from '../services/dashboard.service';

export class DashboardControlador {
  static async resumen(req: Request, res: Response): Promise<void> {
    const { tecnicoId, usuarioId } = req.query;

    const leer = (value: unknown): string | undefined =>
      typeof value === 'string' && value.length > 0 ? value : undefined;

    const reporte = await dashboardServicio.resumen(
      leer(tecnicoId),
      leer(usuarioId),
    );

    res.json(reporte);
  }
}