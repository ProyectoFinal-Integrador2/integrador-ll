import type { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { HttpError } from '../utils/httpError';
import type { CreateUserInput, UpdateUserInput } from '../types/user.types';

export class UserController {
  static async list(_req: Request, res: Response): Promise<void> {
    const users = await userService.list();
    res.json(users);
  }

  static async create(req: Request, res: Response): Promise<void> {
    const user = await userService.create(
      req.body as Partial<CreateUserInput>,
    );
    res.status(201).json(user);
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
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