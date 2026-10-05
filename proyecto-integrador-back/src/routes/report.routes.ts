import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';

const reportRoutes = Router();

reportRoutes.get('/summary', ReportController.summary);

export default reportRoutes;