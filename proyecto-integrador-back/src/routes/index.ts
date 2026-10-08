import { Router } from 'express';
import { requerirAutenticacion, requerirRol } from '../middlewares/auth';
import availabilityRoutes from './availability.routes';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import equipmentRoutes from './equipment.routes';
import evaluationRoutes from './evaluation.routes';
import reportRoutes from './report.routes';
import healthRoutes from './health.routes';
import knowledgeRoutes from './knowledge.routes';
import slaRoutes from './sla.routes';
import ticketRoutes from './ticket.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

router.use(requerirAutenticacion);

router.use('/dashboard', dashboardRoutes);
router.use('/tickets', ticketRoutes);
router.use('/knowledge-base', knowledgeRoutes);

router.use('/users', userRoutes);
router.use('/equipments', requerirRol('Jefe TI'), equipmentRoutes);
router.use('/sla', requerirRol('Jefe TI'), slaRoutes);
router.use('/reports', requerirRol('Jefe TI'), reportRoutes);

router.use('/availability', requerirRol('Jefe TI', 'Técnico'), availabilityRoutes);
router.use('/evaluations', requerirRol('Jefe TI', 'Usuario'), evaluationRoutes);

export default router;
