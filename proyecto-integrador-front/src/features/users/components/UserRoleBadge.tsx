import type { UserRole } from '../types/user.types';

interface UserRoleBadgeProps {
  role: UserRole;
}

export const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  const getRoleStyles = () => {
    switch (role) {
      case 'Jefe TI':
        return 'bg-[#d9edf7] text-[#1976d2]';
      case 'Técnico':
        return 'bg-[#dcfce7] text-[#2e7d32]';
      case 'Usuario':
      default:
        return 'bg-[#e2e8f0] text-[#475569]';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${getRoleStyles()}`}
    >
      {role}
    </span>
  );
};
