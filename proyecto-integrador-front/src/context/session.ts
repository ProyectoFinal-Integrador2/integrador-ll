import { createContext, useContext } from 'react';
import type { User } from '@/types/user.types';
import type { UserRole } from '@/types/roles';

export interface SessionContextValue {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export const useSession = (): SessionContextValue => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe usarse dentro de <SessionProvider>');
  }
  return context;
};