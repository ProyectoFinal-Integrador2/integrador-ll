import type { UserRole } from '@/types/roles';

/**
 * Mapa unico de estilo por rol.
 *
 * Antes cada componente pintaba los roles por su cuenta y el mismo rol
 * aparecia con colores distintos (Jefe TI era azul en UserRoleBadge y
 * verde en EditarPerfil). Cualquier cambio de paleta se hace aqui.
 *
 * Vive en scope compartido porque lo consumen tanto la feature de usuarios
 * como el Shell (Sidebar), que no debe depender de ninguna feature.
 */
export const ROLE_STYLES: Record<UserRole, string> = {
  'Jefe TI': 'bg-[#d9edf7] text-[#1976d2]',
  'Técnico': 'bg-[#dcfce7] text-[#2e7d32]',
  'Usuario': 'bg-[#e2e8f0] text-[#475569]',
};
