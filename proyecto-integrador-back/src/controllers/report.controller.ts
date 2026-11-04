import type { Request, Response } from 'express';
import { servicioDeReportes } from '../services/report.service';

export class ReporteControlador {
  static async resumen(_req: Request, res: Response): Promise<void> {
    const reporte = await servicioDeReportes.resumen();
    res.json(reporte);
  }

  static async sla(_req: Request, res: Response): Promise<void> {
    const reporte = await servicioDeReportes.cumplimientoSla();
    res.json(reporte);
  }

  static async carga(_req: Request, res: Response): Promise<void> {
    const reporte = await servicioDeReportes.cargaTecnicos();
    res.json(reporte);
  }

  static async fallas(_req: Request, res: Response): Promise<void> {
    const reporte = await servicioDeReportes.fallasPorEquipo();
    res.json(reporte);
  }

  static async satisfaccion(_req: Request, res: Response): Promise<void> {
    const reporte = await servicioDeReportes.satisfaccion();
    res.json(reporte);
  }

  static async conocimiento(_req: Request, res: Response): Promise<void> {
    const reporte = await servicioDeReportes.conocimientoMasConsultado();
    res.json(reporte);
  }
}