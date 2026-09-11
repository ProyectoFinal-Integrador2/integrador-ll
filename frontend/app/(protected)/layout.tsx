'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const roleRoutesMap: Record<UserRole, string> = {
  jefe_ti: '/dashboard/jefe-ti',
  tecnico: '/dashboard/tecnico',
  usuario: '/dashboard/usuario',
};

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { session, role, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.replace('/login');
        return;
      }

      if (!role) {
        router.replace('/login');
        return;
      }

      const expectedDashboard = roleRoutesMap[role];

      if (pathname === '/dashboard' || pathname === '/dashboard/') {
        router.replace(expectedDashboard);
        return;
      }

      if (pathname.startsWith('/dashboard/jefe-ti') && role !== 'jefe_ti') {
        router.replace(expectedDashboard);
      } else if (pathname.startsWith('/dashboard/tecnico') && role !== 'tecnico') {
        router.replace(expectedDashboard);
      } else if (pathname.startsWith('/dashboard/usuario') && role !== 'usuario') {
        router.replace(expectedDashboard);
      }
    }
  }, [session, role, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center text-white text-sm">
        Validando sesión y permisos...
      </div>
    );
  }

  if (!session || !role) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <span className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">SI</span>
          <span className="font-semibold text-lg text-white">Sistema de Incidencias</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-blue-400 capitalize font-medium">Rol: {role.replace('_', ' ')}</span>
          <button
            onClick={() => logout()}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-red-600 rounded-lg text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}
