import { Router } from 'express';
import { ReporteControlador } from '../controllers/report.controller';

const reportRoutes = Router();

reportRoutes.get('/summary', ReporteControlador.resumen);
reportRoutes.get('/sla', ReporteControlador.sla);
reportRoutes.get('/workload', ReporteControlador.carga);
reportRoutes.get('/equipment-failures', ReporteControlador.fallas);
reportRoutes.get('/satisfaction', ReporteControlador.satisfaccion);
reportRoutes.get('/knowledge', ReporteControlador.conocimiento);

export default reportRoutes;