import { Router } from 'express';
import { EvaluationController } from '../controllers/evaluation.controller';

const evaluationRoutes = Router();

evaluationRoutes.get('/', EvaluationController.list);

// Antes que el `post('/')` no importa, pero queda explicito: `pending` es un
// caminho fijo y no un id.
evaluationRoutes.get('/pending', EvaluationController.listPending);

evaluationRoutes.post('/', EvaluationController.create);

export default evaluationRoutes;