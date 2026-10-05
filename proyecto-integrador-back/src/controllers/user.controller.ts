import type { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { HttpError } from '../utils/httpError';
import type { CreateUserInput, UpdateUserInput } from '../types/user.types';

export class UserController {
  /** GET /api/v1/users */
  static async list(_req: Request, res: Response): Promise<void> {
    const users = await userService.list();
    res.json(users);
  }

  /** POST /api/v1/users */
  static async create(req: Request, res: Response): Promise<void> {
    // Express 5 encamina las promesas rechazadas al errorHandler, asi que
    // los HttpError del service llegan aqui sin try/catch.
    const user = await userService.create(
      req.body as Partial<CreateUserInput>,
    );
    res.status(201).json(user);
  }

  /** PUT /api/v1/users/:id */
  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    // Express 5 tipa los params como string | string[]. El patron de la ruta
    // es un solo segmento, asi que un array solo puede venir de una entrada
    // mal formada y no hay un id que buscar.
    if (typeof id !== 'string') {
      throw HttpError.badRequest('El id del usuario no es valido.');
    }

    const user = await userService.update(
      id,
      req.body as Partial<UpdateUserInput>,
    );
    res.json(user);
  }
}