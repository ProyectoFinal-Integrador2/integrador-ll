import { Router } from 'express';
import { UsuarioControlador } from '../controllers/user.controller';
import { requerirRol } from '../middlewares/auth';

const userRoutes = Router();

userRoutes.get('/', requerirRol('Jefe TI'), UsuarioControlador.listar);
userRoutes.post('/', requerirRol('Jefe TI'), UsuarioControlador.crear);
userRoutes.put('/:id', requerirRol('Jefe TI'), UsuarioControlador.actualizar);
userRoutes.patch('/:id/profile', UsuarioControlador.actualizarPerfil);
userRoutes.patch('/:id/password', UsuarioControlador.cambiarContrasena);

export default userRoutes;
