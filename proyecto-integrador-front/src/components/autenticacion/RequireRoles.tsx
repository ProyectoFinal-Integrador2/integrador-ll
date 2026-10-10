import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/context/session';
import type { RolUsuario } from '@/types/roles';

interface RequireRolesProps {
  allow: RolUsuario[];
}

export const RequireRoles = ({ allow }: RequireRolesProps) => {
  const { user } = useSession();

  if (!user) return <Navigate to="/login" replace />;

  if (!allow.includes(user.rol)) {
    return <Navigate to="/perfil" replace />;
  }

  return <Outlet />;
};