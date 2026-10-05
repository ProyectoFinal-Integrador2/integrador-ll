import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/httpError';

/**
 * Ultimo middleware de la cadena. Express distingue los handlers de error
 * por su aridad de cuatro parametros, por eso `next` no se puede omitir.
 *
 * Un HttpError lleva su propio status (400, 404, ...). Cualquier otro error
 * se considera inesperado y responde 500 sin filtrar el mensaje al cliente.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
