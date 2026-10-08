export const ROLES_USUARIO = ['Jefe TI', 'Técnico', 'Usuario'] as const;

export const ESTADOS_USUARIO = ['Activo', 'Inactivo'] as const;

export type RolUsuario = (typeof ROLES_USUARIO)[number];

export type EstadoUsuario = (typeof ESTADOS_USUARIO)[number];

/**
 * El color del avatar se deriva del rol, no se guarda: asi un cambio de rol
 * repinta el avatar solo y no puede quedar desincronizado.
 */
export type ColorAvatar = 'blue' | 'green' | 'amber';

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

/**
 * El alta la decide el dominio: un usuario nace activo y con el avatar ya
 * calculado, asi que el frontend no manda `estado` ni `avatarIniciales`.
 */
export interface CrearUsuarioInput {
  nombre: string;
  correo: string;
  rol: RolUsuario;
  area: string;
  contrasena: string;
}

/** La edicion si permite cambiar el estado, a diferencia del alta. */
export interface ActualizarUsuarioInput {
  nombre: string;
  correo: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
}