import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';

const ticketRoutes = Router();

ticketRoutes.get('/', TicketController.list);
ticketRoutes.post('/', TicketController.create);
ticketRoutes.patch('/:id', TicketController.changeStatus);

export default ticketRoutes;
