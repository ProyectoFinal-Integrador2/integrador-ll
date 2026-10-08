import type { Request, Response } from 'express';
import { servicioDeReportes } from '../services/report.service';

export class ReporteControlador {
  static async resumen(_req: Request, res: Response): Promise<void> {
    const reporte = await servicioDeReportes.resumen();
    res.json(reporte);
  }
}