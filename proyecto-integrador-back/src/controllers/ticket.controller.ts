import type { Request, Response } from 'express';
import { ticketService } from '../services/ticket.service';
import type { CreateTicketInput, UpdateTicketStatusInput } from '../types/ticket.types';

export class TicketController {
  /** GET /api/v1/tickets */
  static async list(_req: Request, res: Response): Promise<void> {
    const tickets = await ticketService.list();
    res.json(tickets);
  }

  /** POST /api/v1/tickets */
  static async create(req: Request, res: Response): Promise<void> {
    // Express 5 encamina las promesas rechazadas al errorHandler, asi que
    // los HttpError del service llegan aqui sin try/catch.
    const ticket = await ticketService.create(
      req.body as Partial<CreateTicketInput>,
    );
    res.status(201).json(ticket);
  }

  /** PATCH /api/v1/tickets/:id */
  static async changeStatus(req: Request, res: Response): Promise<void> {
    // Los tipos de params de Express lo declaran como `string | string[]`, pero
    // con la ruta `/tickets/:id` siempre llega un solo valor.
    const { id } = req.params;

    const ticket = await ticketService.changeStatus(
      Array.isArray(id) ? id[0] : id,
      req.body as Partial<UpdateTicketStatusInput>,
    );

    res.json(ticket);
  }
}
