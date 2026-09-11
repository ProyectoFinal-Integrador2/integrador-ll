export type UserRole = 'Jefe TI' | 'Técnico' | 'Usuario';

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
  avatarColor: 'blue' | 'green' | 'amber';
}
