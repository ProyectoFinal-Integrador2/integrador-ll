import type { NextFunction, Request, Response } from 'express';

/**
 * Ultimo middleware de la cadena. Express distingue los handlers de error
 * por su aridad de cuatro parametros, por eso `next` no se puede omitir.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(err);

  res.status(500).json({ error: 'Error interno del servidor' });
};
