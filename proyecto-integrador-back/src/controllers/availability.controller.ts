import type { Request, Response } from 'express';
import { availabilityService } from '../services/availability.service';

export class AvailabilityController {
  /** GET /api/v1/availability */
  static async list(_req: Request, res: Response): Promise<void> {
    const technicians = await availabilityService.list();
    res.json(technicians);
  }
}