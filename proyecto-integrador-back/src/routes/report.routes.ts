import { Router } from 'express';
import { ReporteControlador } from '../controllers/report.controller';

const reportRoutes = Router();

reportRoutes.get('/summary', ReporteControlador.resumen);

export default reportRoutes;