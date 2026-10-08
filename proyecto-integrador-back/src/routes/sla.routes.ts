import { Router } from 'express';
import { SlaControlador } from '../controllers/sla.controller';

const slaRoutes = Router();

slaRoutes.get('/', SlaControlador.listar);
slaRoutes.post('/', SlaControlador.crear);
slaRoutes.put('/:id', SlaControlador.actualizar);

export default slaRoutes;