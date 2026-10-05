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
