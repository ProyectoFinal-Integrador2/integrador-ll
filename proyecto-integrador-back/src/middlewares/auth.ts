import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../../proyecto-integrador-back/src/config/env';
import { HttpError } from '../utils/httpError';
import type { PayloadToken, SesionUsuario } from '../types/auth.types';
import type { RolUsuario } from '../types/user.types';

const leerToken = (req: Request): string => {
  const cabecera = req.headers.authorization;

  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    throw HttpError.unauthorized('Sesion no iniciada.');
  }

  return cabecera.slice('Bearer '.length);
};

export const requerirAutenticacion = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const payload = jwt.verify(leerToken(req), env.jwtSecret) as PayloadToken;

    req.sesion = {
      id: payload.sub,
      nombre: payload.nombre,
      correo: payload.correo,
      rol: payload.rol,
    };

    next();
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw HttpError.unauthorized('Sesion invalida o expirada.');
  }
};

export const requerirRol =
  (...roles: RolUsuario[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.sesion) {
      throw HttpError.unauthorized('Sesion no iniciada.');
    }

    if (!roles.includes(req.sesion.rol)) {
      throw HttpError.forbidden('Tu rol no tiene permiso para esta accion.');
    }

    next();
  };
