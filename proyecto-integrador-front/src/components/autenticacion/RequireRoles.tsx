import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/context/session';
import type { UserRole } from '@/types/roles';

interface RequireRolesProps {
  /** Roles con acceso. Los demas vuelven a su perfil. */
  allow: UserRole[];
}

/**
 * Limita un grupo de rutas a ciertos roles.
 *
 * Ocultar los enlaces del Sidebar no alcanza: cualquiera puede escribir la URL a
 * mano. Este guard evita entrar a una pantalla que no le corresponde.
 *
 * Ojo con lo que esto NO es: la sesion sale de `MOCK_USERS` y el backend no
 * valida roles, asi que sigue siendo una barrera de interfaz. La autorizacion
 * real tiene que aplicarse en la API cuando exista autenticacion de verdad.
 */
export const RequireRoles = ({ allow }: RequireRolesProps) => {
  const { user } = useSession();

  if (!user) return <Navigate to="/login" replace />;

  if (!allow.includes(user.role)) {
    return <Navigate to="/perfil" replace />;
  }

  return <Outlet />;
};