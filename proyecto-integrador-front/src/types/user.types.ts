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
  fono: string | null;
  debeCambiarContrasena: boolean;
  avatarIniciales: string;
  colorAvatar: ColorAvatar;
}

export interface CrearUsuarioInput {
  nombre: string;
  correo: string;
  rol: RolUsuario;
  area: string;
  fono: string;
}

/** Respuesta de POST /users: el backend genera la contraseña temporal. */
export interface UsuarioCreado {
  usuario: Usuario;
  contrasenaGenerada: string;
}

export interface ActualizarUsuarioInput {
  nombre: string;
  correo: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
}