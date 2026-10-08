import type { ColorAvatar } from '@/utils/avatarStyles';
import type { RolUsuario } from '@/types/roles';

export type { RolUsuario, ColorAvatar };

export type EstadoUsuario = 'Activo' | 'Inactivo';

export type FiltroUsuario = 'todos' | 'tecnicos' | 'usuarios';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  area: string;
  estado: EstadoUsuario;
  avatarIniciales: string;
  colorAvatar: ColorAvatar;
}

export interface CrearUsuarioInput {
  nombre: string;
  correo: string;
  rol: RolUsuario;
  area: string;
  contrasena: string;
}

export interface ActualizarUsuarioInput {
  nombre: string;
  correo: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
}