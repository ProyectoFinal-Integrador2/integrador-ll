import type { Request, Response } from 'express';
import { ticketService } from '../services/ticket.service';
import type { CreateTicketInput, UpdateTicketStatusInput } from '../types/ticket.types';

export class TicketController {
  static async list(_req: Request, res: Response): Promise<void> {
    const tickets = await ticketService.list();
    res.json(tickets);
  }

  static async create(req: Request, res: Response): Promise<void> {
     const ticket = await ticketService.create(
      req.body as Partial<CreateTicketInput>,
    );
    res.status(201).json(ticket);
  }

  static async changeStatus(req: Request, res: Response): Promise<void> {
      const { id } = req.params;

    const ticket = await ticketService.changeStatus(
      Array.isArray(id) ? id[0] : id,
      req.body as Partial<UpdateTicketStatusInput>,
    );

    res.json(ticket);
  }
}
