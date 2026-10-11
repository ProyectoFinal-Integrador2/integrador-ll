import { apiGet, apiSend } from './apiClient';
import type { Usuario } from '@/types/user.types';
import type { RolUsuario } from '@/types/roles';

export interface SesionIniciada {
  token: string;
  usuario: Usuario;
}

export const iniciarSesion = (
  correo: string,
  contrasena: string,
  rol: RolUsuario,
): Promise<SesionIniciada> =>
  apiSend<SesionIniciada>('/auth/login', 'POST', { correo, contrasena, rol });

export const obtenerSesion = (signal?: AbortSignal): Promise<Usuario> =>
  apiGet<Usuario>('/auth/me', signal);
