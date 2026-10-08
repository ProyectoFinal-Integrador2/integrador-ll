import { apiGet, apiSend } from './apiClient';
import type { CrearUsuarioInput, ActualizarUsuarioInput, Usuario, UsuarioCreado } from '../types/user.types';

export const obtenerUsuarios = (signal?: AbortSignal): Promise<Usuario[]> =>
  apiGet<Usuario[]>('/users', signal);

export const crearUsuario = (input: CrearUsuarioInput): Promise<UsuarioCreado> =>
  apiSend<UsuarioCreado>('/users', 'POST', input);

export const actualizarUsuario = (
  id: string,
  input: ActualizarUsuarioInput,
): Promise<Usuario> => apiSend<Usuario>(`/users/${id}`, 'PUT', input);

export const actualizarPerfil = (
  id: string,
  input: { nombre: string; area: string },
): Promise<Usuario> => apiSend<Usuario>(`/users/${id}/profile`, 'PATCH', input);

export const cambiarContrasena = (
  id: string,
  input: { actual: string; nueva: string },
): Promise<Usuario> =>
  apiSend<Usuario>(`/users/${id}/password`, 'PATCH', input);