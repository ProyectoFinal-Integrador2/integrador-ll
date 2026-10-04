import { Router } from 'express';
import healthRoutes from './health.routes';

//Por cada Router que tengamos, lo importamos y lo usamos en el router principal
const router = Router();

router.use('/health', healthRoutes);

export default router;
