import { Router } from 'express';
import { DisponibilidadControlador } from '../controllers/availability.controller';

const availabilityRoutes = Router();

availabilityRoutes.get('/', DisponibilidadControlador.listar);
availabilityRoutes.post('/', DisponibilidadControlador.crearActualizar);

export default availabilityRoutes;