import { Router } from 'express';
import availabilityRoutes from './availability.routes';
import dashboardRoutes from './dashboard.routes';
import equipmentRoutes from './equipment.routes';
import evaluationRoutes from './evaluation.routes';
import reportRoutes from './report.routes';
import healthRoutes from './health.routes';
import knowledgeRoutes from './knowledge.routes';
import slaRoutes from './sla.routes';
import ticketRoutes from './ticket.routes';
import userRoutes from './user.routes';

//Por cada Router que tengamos, lo importamos y lo usamos en el router principal
const router = Router();

router.use('/health', healthRoutes);
router.use('/tickets', ticketRoutes);
router.use('/users', userRoutes);
router.use('/equipments', equipmentRoutes);
router.use('/sla', slaRoutes);
router.use('/availability', availabilityRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/reports', reportRoutes);
router.use('/knowledge-base', knowledgeRoutes);

export default router;