import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { usuarioRepositorio, type UsuarioRepositorio } from '../repositories/user.repository';
import { HttpError } from '../utils/httpError';
import { verificarPassword } from '../utils/password';
import type { PayloadToken } from '../types/auth.types';
import { ROLES_USUARIO, type RolUsuario, type Usuario } from '../types/user.types';
import { intentosRepositorio, type IntentosRepositorio } from '../repositories/loginAttempts.repository';

/** Exige parte local y arroba. */
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DURACION_SESION = '8h';

export interface SesionIniciada {
  token: string;
  usuario: Usuario;
}

export class AuthService {
  constructor(
    private readonly repositorio: UsuarioRepositorio,
    private readonly intentos: IntentosRepositorio = intentosRepositorio,
    private readonly ahora: () => number = Date.now,
  ) {}

  async login(correo: string, contrasena: string, rol?: RolUsuario): Promise<SesionIniciada> {
    const normalizado = correo.trim().toLowerCase();

    if (!PATRON_CORREO.test(normalizado) || contrasena.length === 0) {
      throw HttpError.unauthorized('Correo o contrasena incorrectos.');
    }

    if (rol !== undefined && !ROLES_USUARIO.includes(rol)) {
      throw HttpError.badRequest('Rol no valido.');
    }

    // Se devuelve el error desde la transaccion para confirmar el contador antes de lanzarlo.
    const resultado = await this.intentos.conBloqueo(normalizado, async (estado, guardar) => {
      const ahora = this.ahora();
      const errorBloqueo = (hasta: string) => new HttpError(429,
        'Este correo está bloqueado temporalmente por 3 intentos fallidos.', {
          intentosRestantes: 0, bloqueadoHasta: hasta,
          segundosRestantes: Math.max(1, Math.ceil((Date.parse(hasta) - ahora) / 1000)),
        });
      if (estado.bloqueadoHasta && Date.parse(estado.bloqueadoHasta) > ahora) {
        return errorBloqueo(estado.bloqueadoHasta);
      }
      const anteriores = estado.bloqueadoHasta ? 0 : estado.intentos;
      const credencial = await this.repositorio.obtenerCredencialPorCorreo(normalizado);

      if (!credencial || !verificarPassword(contrasena, credencial.passwordHash)) {
        const fallos = anteriores + 1;
        const hasta = fallos >= 3 ? new Date(ahora + 15 * 60 * 1000).toISOString() : null;
        await guardar({ intentos: fallos, bloqueadoHasta: hasta });
        if (hasta) return errorBloqueo(hasta);
        return new HttpError(401, 'Correo o contraseña incorrectos.', {
          intentosRestantes: 3 - fallos, bloqueadoHasta: null,
        });
      }

      if (credencial.usuario.estado !== 'Activo') {
        return HttpError.forbidden('La cuenta esta inactiva. Contacta al Jefe de TI.');
      }

      if (rol !== undefined && rol !== credencial.usuario.rol) {
        return HttpError.unauthorized('El rol seleccionado no corresponde a este usuario.');
      }

      const payload: PayloadToken = {
        sub: credencial.usuario.id,
        nombre: credencial.usuario.nombre,
        correo: credencial.usuario.correo,
        rol: credencial.usuario.rol,
      };

      const token = jwt.sign(payload, env.jwtSecret, { expiresIn: DURACION_SESION });

      await guardar({ intentos: 0, bloqueadoHasta: null });
      return { token, usuario: credencial.usuario };
    });
    if (resultado instanceof HttpError) throw resultado;
    return resultado;
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
