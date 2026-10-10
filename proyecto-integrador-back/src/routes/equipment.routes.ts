import { Router } from 'express';
import { EquipoControlador } from '../controllers/equipment.controller';
import { requerirRol } from '../middlewares/auth';

const equipmentRoutes = Router();

equipmentRoutes.get('/', EquipoControlador.listar);
equipmentRoutes.post('/', requerirRol('Jefe TI'), EquipoControlador.crear);
equipmentRoutes.put('/:id', requerirRol('Jefe TI'), EquipoControlador.actualizar);

export default equipmentRoutes;