import { Router } from 'express';
import { EvaluacionControlador } from '../controllers/evaluation.controller';

const evaluationRoutes = Router();

evaluationRoutes.get('/', EvaluacionControlador.listar);

// Antes que el `post('/')` no importa, pero queda explicito: `pending` es un
// camino fijo y no un id.
evaluationRoutes.get('/pending', EvaluacionControlador.listarPendientes);

evaluationRoutes.post('/', EvaluacionControlador.crear);

export default evaluationRoutes;