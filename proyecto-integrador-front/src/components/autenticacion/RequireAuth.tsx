import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/context/session';

export const RequireAuth = () => {
  const { user, cargando } = useSession();
  const location = useLocation();

  if (cargando) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.debeCambiarContrasena && location.pathname !== '/perfil') {
    return <Navigate to="/perfil" replace />;
  }

  return <Outlet />;
};
