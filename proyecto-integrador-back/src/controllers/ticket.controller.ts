import type { Request, Response } from 'express';
import { ticketServicio } from '../services/ticket.service';
import type { CrearTicketInput, ActualizarEstadoTicketInput } from '../types/ticket.types';

export class TicketControlador {
  static async listar(_req: Request, res: Response): Promise<void> {
    const tickets = await ticketServicio.listar();
    res.json(tickets);
  }

  static async crear(req: Request, res: Response): Promise<void> {
    const ticket = await ticketServicio.crear(
      req.body as Partial<CrearTicketInput>,
    );
    res.status(201).json(ticket);
  }

  static async cambiarEstado(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const ticket = await ticketServicio.cambiarEstado(
      Array.isArray(id) ? id[0] : id,
      req.body as Partial<ActualizarEstadoTicketInput>,
      req.sesion,
    );

    res.json(ticket);
  }
}