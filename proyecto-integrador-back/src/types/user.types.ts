export const USER_ROLES = ['Jefe TI', 'Técnico', 'Usuario'] as const;

export const USER_STATUSES = ['Activo', 'Inactivo'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type UserStatus = (typeof USER_STATUSES)[number];

/**
 * El color del avatar se deriva del rol, no se guarda: asi un cambio de rol
 * repinta el avatar solo y no puede quedar desincronizado.
 */
export type AvatarColor = 'blue' | 'green' | 'amber';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  area: string;
  status: UserStatus;
  avatarInitials: string;
  avatarColor: AvatarColor;
}

/**
 * El alta la decide el dominio: un usuario nace activo y con el avatar ya
 * calculado, asi que el frontend no manda `status` ni `avatarInitials`.
 */
export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  area: string;
}

/** La edicion si permite cambiar el estado, a diferencia del alta. */
export interface UpdateUserInput {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}