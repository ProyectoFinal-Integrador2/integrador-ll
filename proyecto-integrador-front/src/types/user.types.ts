import type { AvatarColor } from '@/constants/avatarStyles';
import type { UserRole } from '@/types/roles';

export type { UserRole, AvatarColor };

export type UserStatus = 'Activo' | 'Inactivo';

export type UserTabFilter = 'todos' | 'tecnicos' | 'usuarios';

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
 * Refleja lo que el back acepta en POST /users. El estado y el avatar los
 * decide el dominio, asi que no viajan en el alta.
 */
export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  area: string;
}

/** Lo que acepta PUT /users/:id: a diferencia del alta, si cambia el estado. */
export interface UpdateUserInput {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
