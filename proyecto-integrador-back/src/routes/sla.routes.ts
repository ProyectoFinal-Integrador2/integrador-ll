import { Router } from 'express';
import { SlaControlador } from '../controllers/sla.controller';
import { requerirRol } from '../middlewares/auth';

const slaRoutes = Router();

slaRoutes.get('/', SlaControlador.listar);
slaRoutes.post('/', requerirRol('Jefe TI'), SlaControlador.crear);
slaRoutes.put('/:id', requerirRol('Jefe TI'), SlaControlador.actualizar);

export default slaRoutes;