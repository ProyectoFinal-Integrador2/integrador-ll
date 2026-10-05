import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';

const equipmentRoutes = Router();

equipmentRoutes.get('/', EquipmentController.list);
equipmentRoutes.post('/', EquipmentController.create);
equipmentRoutes.put('/:id', EquipmentController.update);

export default equipmentRoutes;