import { ESTILOS_ROL } from '@/utils/roleStyles';
import type { RolUsuario } from '@/types/roles';

interface UserRoleBadgeProps {
  role: RolUsuario;
}

export const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${ESTILOS_ROL[role]}`}
    >
      {role}
    </span>
  );
};
