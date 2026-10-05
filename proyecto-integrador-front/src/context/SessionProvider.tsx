import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { MOCK_USERS } from '@/services/mockUsers';
import type { User } from '@/types/user.types';
import type { UserRole } from '@/types/roles';
import { SessionContext } from './session';

const STORAGE_KEY = 'helpdesk.session.role';

/**
 * Primer usuario de MOCK_USERS con el rol pedido.
 *
 * Todavia no hay backend de autenticacion: la identidad se saca de la tabla de
 * usuarios en lugar de validarse contra un servidor. Cuando exista auth real,
 * login() pegara a la API y el import de MOCK_USERS desaparece.
 */
const findUserByRole = (role: UserRole): User => {
  const match = MOCK_USERS.find((candidate) => candidate.role === role);
  return match ?? MOCK_USERS[0];
};

const readStoredRole = (): UserRole | null => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored === 'Jefe TI' || stored === 'Técnico' || stored === 'Usuario' ? stored : null;
  } catch {
    // sessionStorage puede estar bloqueado (modo privado, permisos).
    return null;
  }
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const role = readStoredRole();
    return role ? findUserByRole(role) : null;
  });

  const login = useCallback((role: UserRole) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, role);
    } catch {
      // Sin persistencia la sesion vive solo mientras no se recargue.
    }
    setUser(findUserByRole(role));
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ver login().
    }
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <SessionContext value={value}>{children}</SessionContext>;
};