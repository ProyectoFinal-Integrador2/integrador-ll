import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { borrarToken, guardarToken, leerToken } from '@/services/sessionStore';
import { iniciarSesion, obtenerSesion } from '@/services/authApi';
import type { Usuario } from '@/types/user.types';
import type { RolUsuario } from '@/types/roles';
import { SessionContext } from './session';

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState<boolean>(() => leerToken() !== null);

  useEffect(() => {
    if (!leerToken()) return;

    let cancelado = false;

    obtenerSesion()
      .then((usuario) => {
        if (!cancelado) setUser(usuario);
      })
      .catch(() => {
        borrarToken();
        if (!cancelado) setUser(null);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const login = useCallback(async (correo: string, contrasena: string, rol: RolUsuario) => {
    const sesion = await iniciarSesion(correo, contrasena, rol);
    guardarToken(sesion.token);
    setUser(sesion.usuario);
  }, []);

  const logout = useCallback(() => {
    borrarToken();
    setUser(null);
  }, []);

  const actualizarSesion = useCallback((usuario: Usuario) => {
    setUser(usuario);
  }, []);

  const value = useMemo(
    () => ({ user, cargando, login, logout, actualizarSesion }),
    [user, cargando, login, logout, actualizarSesion],
  );

  return <SessionContext value={value}>{children}</SessionContext>;
};
