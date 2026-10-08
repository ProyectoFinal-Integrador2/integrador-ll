import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { usuarioRepositorio, type UsuarioRepositorio } from '../repositories/user.repository';
import { HttpError } from '../utils/httpError';
import { verificarPassword } from '../utils/password';
import type { PayloadToken } from '../types/auth.types';
import type { Usuario } from '../types/user.types';

/** Exige parte local y arroba. */
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DURACION_SESION = '8h';

export interface SesionIniciada {
  token: string;
  usuario: Usuario;
}

export class AuthService {
  constructor(private readonly repositorio: UsuarioRepositorio) {}

  async login(correo: string, contrasena: string): Promise<SesionIniciada> {
    const normalizado = correo.trim().toLowerCase();

    if (!PATRON_CORREO.test(normalizado) || contrasena.length === 0) {
      throw HttpError.unauthorized('Correo o contrasena incorrectos.');
    }

    const credencial = await this.repositorio.obtenerCredencialPorCorreo(normalizado);

    if (!credencial || !verificarPassword(contrasena, credencial.passwordHash)) {
      throw HttpError.unauthorized('Correo o contrasena incorrectos.');
    }

    if (credencial.usuario.estado !== 'Activo') {
      throw HttpError.forbidden('La cuenta esta inactiva. Contacta al Jefe de TI.');
    }

    const payload: PayloadToken = {
      sub: credencial.usuario.id,
      nombre: credencial.usuario.nombre,
      correo: credencial.usuario.correo,
      rol: credencial.usuario.rol,
    };

    const token = jwt.sign(payload, env.jwtSecret, { expiresIn: DURACION_SESION });

    return { token, usuario: credencial.usuario };
  }

  async obtenerUsuario(id: string): Promise<Usuario> {
    const usuario = await this.repositorio.obtenerPorId(id);

    if (!usuario) {
      throw HttpError.unauthorized('Sesion invalida.');
    }

    return usuario;
  }
}

export const authService = new AuthService(usuarioRepositorio);
