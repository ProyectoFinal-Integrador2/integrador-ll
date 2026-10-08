import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/context/session';

/** Bloquea las rutas privadas: sin sesion manda a /login y recuerda el destino. */
export const RequireAuth = () => {
  const { user, cargando } = useSession();
  const location = useLocation();

  if (cargando) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};
