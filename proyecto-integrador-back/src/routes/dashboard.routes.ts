import { Router } from 'express';
import { DashboardControlador } from '../controllers/dashboard.controller';

const dashboardRoutes = Router();

dashboardRoutes.get('/', DashboardControlador.resumen);

export default dashboardRoutes;