import type { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { HttpError } from '../utils/httpError';
import type { RolUsuario } from '../types/user.types';

export class AuthControlador {
  static async login(req: Request, res: Response): Promise<void> {
    const { correo, contrasena, rol } = (req.body ?? {}) as Record<string, unknown>;

    if (typeof correo !== 'string' || typeof contrasena !== 'string') {
      throw HttpError.badRequest('Correo y contrasena son obligatorios.');
    }

    if (rol !== undefined && typeof rol !== 'string') {
      throw HttpError.badRequest('Rol no valido.');
    }

    res.json(await authService.login(correo, contrasena, rol as RolUsuario | undefined));
  }

  static async me(req: Request, res: Response): Promise<void> {
    if (!req.sesion) {
      throw HttpError.unauthorized('Sesion no iniciada.');
    }

    res.json(await authService.obtenerUsuario(req.sesion.id));
  }
}
