import type { Request, Response } from 'express';

/** Cualquier ruta que no haya respondido cae aqui. */
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: `${req.method} ${req.originalUrl}`,
  });
};
