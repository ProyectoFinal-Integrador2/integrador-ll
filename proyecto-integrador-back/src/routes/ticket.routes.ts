import { Router } from 'express';
import { TicketControlador } from '../controllers/ticket.controller';

const ticketRoutes = Router();

ticketRoutes.get('/', TicketControlador.listar);
ticketRoutes.post('/', TicketControlador.crear);
ticketRoutes.patch('/:id', TicketControlador.cambiarEstado);

export default ticketRoutes;