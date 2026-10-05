import { Router } from 'express';
import healthRoutes from './health.routes';
import ticketRoutes from './ticket.routes';

//Por cada Router que tengamos, lo importamos y lo usamos en el router principal
const router = Router();

router.use('/health', healthRoutes);
router.use('/tickets', ticketRoutes);

export default router;
