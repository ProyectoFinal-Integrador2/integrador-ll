import type { Request, Response } from 'express';

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: `${req.method} ${req.originalUrl}`,
  });
};
