'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { session, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.replace('/login');
      } else {
        const routes: Record<string, string> = {
          jefe_ti: '/dashboard/jefe-ti',
          tecnico: '/dashboard/tecnico',
          usuario: '/dashboard/usuario',
        };
        router.replace(routes[role || 'usuario'] || '/dashboard/usuario');
      }
    }
  }, [session, role, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span>Cargando plataforma...</span>
      </div>
    </div>
  );
}
