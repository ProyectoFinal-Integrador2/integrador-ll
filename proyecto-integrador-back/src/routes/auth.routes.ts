import { Router } from 'express';
import { AuthControlador } from '../controllers/auth.controller';
import { requerirAutenticacion } from '../middlewares/auth';

const authRoutes = Router();

authRoutes.post('/login', AuthControlador.login);
authRoutes.get('/me', requerirAutenticacion, AuthControlador.me);

export default authRoutes;
