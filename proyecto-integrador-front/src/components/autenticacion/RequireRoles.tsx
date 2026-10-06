import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/context/session';
import type { UserRole } from '@/types/roles';

interface RequireRolesProps {
  allow: UserRole[];
}

export const RequireRoles = ({ allow }: RequireRolesProps) => {
  const { user } = useSession();

  if (!user) return <Navigate to="/login" replace />;

  if (!allow.includes(user.role)) {
    return <Navigate to="/perfil" replace />;
  }

  return <Outlet />;
};