import type { RolUsuario } from './user.types';

export interface SesionUsuario {
  id: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
}

export interface PayloadToken {
  sub: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
}

declare module 'express-serve-static-core' {
  interface Request {
    sesion?: SesionUsuario;
  }
}
