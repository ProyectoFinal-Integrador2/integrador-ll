import { Request, Response } from 'express';
import { authService } from '../services/authService';

export class AuthController {
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email y contraseña son campos obligatorios.' });
        return;
      }

      const { user, session, profile, error } = await authService.signIn(email, password);

      if (error || !user) {
        res.status(error?.status || 401).json({ error: error?.message || 'Credenciales inválidas.' });
        return;
      }

      res.status(200).json({
        message: 'Autenticación exitosa',
        user: { id: user.id, email: user.email },
        profile: {
          id: profile?.id,
          rol: profile?.rol,
          nombre_completo: profile?.nombre_completo,
        },
        token: session?.access_token,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error interno del servidor.' });
    }
  }

  public static async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token de autorización ausente o formato incorrecto.' });
        return;
      }

      const token = authHeader.split(' ')[1];
      const { user, profile, isValid } = await authService.validateToken(token);

      if (!isValid || !user) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
        return;
      }

      res.status(200).json({
        valid: true,
        user: { id: user.id, email: user.email },
        profile: {
          id: profile?.id,
          rol: profile?.rol,
          nombre_completo: profile?.nombre_completo,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error interno del servidor.' });
    }
  }
}
