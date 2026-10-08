import { Router } from 'express';
import { EquipoControlador } from '../controllers/equipment.controller';

const equipmentRoutes = Router();

equipmentRoutes.get('/', EquipoControlador.listar);
equipmentRoutes.post('/', EquipoControlador.crear);
equipmentRoutes.put('/:id', EquipoControlador.actualizar);

export default equipmentRoutes;