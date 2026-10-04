import { EditarPerfil } from '@/features/users';
import { useSession } from '@/session/sessionContext';

/**
 * Adaptador de ruta: EditarPerfil recibe el rol por prop, pero el rol vive en
 * la sesion y el router se evalua en scope de modulo, asi que hace falta un
 * componente para poder llamar al hook.
 */
export const PerfilRoute = () => {
  const { user } = useSession();

  if (!user) return null;

  return <EditarPerfil rolUsuario={user.role} />;
};
