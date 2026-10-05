import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const dashboardRoutes = Router();

dashboardRoutes.get('/', DashboardController.summary);

export default dashboardRoutes;