import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/httpError';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof HttpError) {
    if (err.status === 429 && err.detalles?.segundosRestantes) {
      res.setHeader('Retry-After', err.detalles.segundosRestantes);
    }
    res.status(err.status).json({ error: err.message, ...err.detalles });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
