import { apiGet, apiSend } from './apiClient';
import type { Usuario } from '@/types/user.types';

export interface SesionIniciada {
  token: string;
  usuario: Usuario;
}

export const iniciarSesion = (correo: string, contrasena: string): Promise<SesionIniciada> =>
  apiSend<SesionIniciada>('/auth/login', 'POST', { correo, contrasena });

export const obtenerSesion = (signal?: AbortSignal): Promise<Usuario> =>
  apiGet<Usuario>('/auth/me', signal);
