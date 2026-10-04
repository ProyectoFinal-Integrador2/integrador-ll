export type AvatarColor = 'blue' | 'green' | 'amber';

/**
 * Mapa unico de estilo por color de avatar.
 *
 * Estaba escrito dentro de UsersTable, asi que se recreaba en cada render y
 * el Sidebar no podia reutilizarlo. Ahora tabla y sesion comparten paleta.
 */
export const AVATAR_STYLES: Record<AvatarColor, string> = {
  blue: 'bg-[#d9edf7] text-[#1976d2]',
  green: 'bg-[#dcfce7] text-[#2e7d32]',
  amber: 'bg-[#fef3c7] text-[#b45309]',
};
