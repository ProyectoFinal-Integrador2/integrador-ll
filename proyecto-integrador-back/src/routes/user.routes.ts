import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/', UserController.list);
userRoutes.post('/', UserController.create);
userRoutes.put('/:id', UserController.update);

export default userRoutes;