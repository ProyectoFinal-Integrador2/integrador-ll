import { ROLE_STYLES } from '@/constants/roleStyles';
import type { UserRole } from '@/types/roles';

interface UserRoleBadgeProps {
  role: UserRole;
}

export const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${ROLE_STYLES[role]}`}
    >
      {role}
    </span>
  );
};
