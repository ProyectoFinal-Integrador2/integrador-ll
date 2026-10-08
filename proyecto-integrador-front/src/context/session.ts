import { createContext, useContext } from 'react';
import type { Usuario } from '@/types/user.types';

export interface SessionContextValue {
  user: Usuario | null;
  cargando: boolean;
  login: (correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
  actualizarSesion: (usuario: Usuario) => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export const useSession = (): SessionContextValue => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe usarse dentro de <SessionProvider>.');
  }
  return context;
};
