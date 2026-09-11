'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function UsuarioDashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Portal de Usuario</h1>
          <p className="text-slate-400 mt-1">
            Hola, <span className="text-blue-400 font-semibold">{profile?.nombre_completo}</span>. Registra y consulta el estado de tus incidencias.
          </p>
        </div>
      </div>
    </div>
  );
}
