'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AuthContextType, UserProfile, UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error: profileError } = await supabase
        .schema('bd_sistema_incidencia')
        .from('perfiles')
        .select('id, rol, nombre_completo, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (profileError || !data) return null;

      const userProfile = data as UserProfile;
      setProfile(userProfile);
      setRole(userProfile.rol);
      return userProfile;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            await fetchProfile(initialSession.user.id);
          } else {
            setProfile(null);
            setRole(null);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Error al restaurar sesión');
          setProfile(null);
          setRole(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (
    email: string,
    password: string,
    selectedRole?: UserRole
  ): Promise<{ success: boolean; role?: UserRole; error?: string; status?: number }> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !data.user) {
        const errorMsg = 'Credenciales inválidas. Verifica tu correo y contraseña.';
        setError(errorMsg);
        return { success: false, error: errorMsg, status: authError?.status || 401 };
      }

      const userProfile = await fetchProfile(data.user.id);

      if (!userProfile) {
        const noProfileMsg = 'Perfil no encontrado o sin permisos asignados.';
        setError(noProfileMsg);
        await logout();
        return { success: false, error: noProfileMsg, status: 403 };
      }

      if (selectedRole && userProfile.rol !== selectedRole) {
        const mismatchMsg = `No tienes permisos para acceder como '${selectedRole}'. Tu rol es '${userProfile.rol}'.`;
        setError(mismatchMsg);
        await logout();
        return { success: false, error: mismatchMsg, status: 403 };
      }

      setUser(data.user);
      setSession(data.session);
      return { success: true, role: userProfile.rol };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const getUser = () => user;
  const getRole = () => role;

  const refreshProfile = async () => {
    if (user?.id) return await fetchProfile(user.id);
    return null;
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    role,
    loading,
    error,
    login,
    logout,
    getUser,
    getRole,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
