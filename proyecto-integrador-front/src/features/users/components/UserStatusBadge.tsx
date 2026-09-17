import type { UserStatus } from '../types/user.types';

interface UserStatusBadgeProps {
  status: UserStatus;
}

export const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  const isActivo = status === 'Activo';

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
        isActivo
          ? 'bg-[#dcfce7] text-[#16a34a]'
          : 'bg-[#fee2e2] text-[#dc2626]'
      }`}
    >
      {status}
    </span>
  );
};
