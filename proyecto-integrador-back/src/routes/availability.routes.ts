import { Router } from 'express';
import { AvailabilityController } from '../controllers/availability.controller';

const availabilityRoutes = Router();

availabilityRoutes.get('/', AvailabilityController.list);

export default availabilityRoutes;