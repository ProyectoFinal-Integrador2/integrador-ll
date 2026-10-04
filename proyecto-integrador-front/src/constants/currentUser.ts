import type { UserRole } from '@/types/roles';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  avatarClassName: string;
}

/**
 * Usuario de la sesion activa.
 *
 * No existe autenticacion todavia (HU-01 se perdio en un merge), asi que este
 * archivo hace de sesion para que el Shell deje de hardcodear el nombre, el
 * correo y el rol del usuario que lo ve.
 *
 * Es un concepto distinto al registro que aparece en la tabla de usuarios:
 * el usuario actual vendra de la sesion, no de la lista. Cuando HU-01 se
 * implemente, este archivo se reemplaza por el hook de autenticacion y no
 * habra que tocar ningun componente.
 */
export const CURRENT_USER: CurrentUser = {
  id: '1',
  name: 'Ana Torres',
  email: 'ana.torres@empresa.pe',
  role: 'Jefe TI',
  avatarInitials: 'AT',
  avatarClassName: 'bg-blue-600',
};
