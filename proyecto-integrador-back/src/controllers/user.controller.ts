import type { Request, Response } from 'express';
import { usuarioServicio } from '../services/user.service';
import { HttpError } from '../utils/httpError';
import type { CrearUsuarioInput, ActualizarUsuarioInput } from '../types/user.types';

export class UsuarioControlador {
  static async listar(_req: Request, res: Response): Promise<void> {
    const usuarios = await usuarioServicio.listar();
    res.json(usuarios);
  }

  static async crear(req: Request, res: Response): Promise<void> {
    const resultado = await usuarioServicio.crear(
      req.body as Partial<CrearUsuarioInput>,
    );
    res.status(201).json(resultado);
  }

  static async restablecerContrasena(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (typeof id !== 'string') {
      throw HttpError.badRequest('El id del usuario no es valido.');
    }

    res.json(await usuarioServicio.restablecerContrasena(id));
  }
  static async actualizar(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (typeof id !== 'string') {
      throw HttpError.badRequest('El id del usuario no es valido.');
    }

    const usuario = await usuarioServicio.actualizar(
      id,
      req.body as Partial<ActualizarUsuarioInput>,
    );
    res.json(usuario);
  }

  static async actualizarPerfil(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const body = (req.body ?? {}) as Record<string, unknown>;

    if (!req.sesion) {
      throw HttpError.unauthorized('Sesion no iniciada.');
    }

    if (req.sesion.id !== id) {
      throw HttpError.forbidden('Solo puedes editar tu propio perfil.');
    }

    res.json(await usuarioServicio.actualizarPerfil(id, body));
  }

  static async cambiarContrasena(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { actual, nueva } = (req.body ?? {}) as Record<string, unknown>;

    if (!req.sesion) {
      throw HttpError.unauthorized('Sesion no iniciada.');
    }

    if (req.sesion.id !== id) {
      throw HttpError.forbidden('Solo puedes cambiar tu propia contrasena.');
    }

    if (typeof actual !== 'string' || typeof nueva !== 'string') {
      throw HttpError.badRequest('Debes indicar la contrasena actual y la nueva.');
    }

    res.json(await usuarioServicio.cambiarContrasena(id, actual, nueva));
  }
}