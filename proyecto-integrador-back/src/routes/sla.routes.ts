import { Router } from 'express';
import { SlaController } from '../controllers/sla.controller';

const slaRoutes = Router();

slaRoutes.get('/', SlaController.list);
slaRoutes.post('/', SlaController.create);
slaRoutes.put('/:id', SlaController.update);

export default slaRoutes;