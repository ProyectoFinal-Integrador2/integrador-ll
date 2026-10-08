import type { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { HttpError } from '../utils/httpError';

export class AuthControlador {
  static async login(req: Request, res: Response): Promise<void> {
    const { correo, contrasena } = (req.body ?? {}) as Record<string, unknown>;

    if (typeof correo !== 'string' || typeof contrasena !== 'string') {
      throw HttpError.badRequest('Correo y contrasena son obligatorios.');
    }

    res.json(await authService.login(correo, contrasena));
  }

  static async me(req: Request, res: Response): Promise<void> {
    if (!req.sesion) {
      throw HttpError.unauthorized('Sesion no iniciada.');
    }

    res.json(await authService.obtenerUsuario(req.sesion.id));
  }
}
