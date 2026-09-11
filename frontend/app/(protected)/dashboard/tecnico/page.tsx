'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function TecnicoDashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white">Panel de Trabajo - Soporte Técnico</h1>
        <p className="text-slate-400 mt-1">
          Bienvenido, <span className="text-blue-400 font-semibold">{profile?.nombre_completo}</span>. Aquí puedes ver tus incidencias asignadas.
        </p>
      </div>
    </div>
  );
}
