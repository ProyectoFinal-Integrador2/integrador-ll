import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';

const ticketRoutes = Router();

ticketRoutes.get('/', TicketController.list);
ticketRoutes.post('/', TicketController.create);

export default ticketRoutes;
