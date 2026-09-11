'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

interface LoginInputs {
  email: string;
  password: string;
}

const roleOptions: { key: UserRole; label: string; icon: string; description: string }[] = [
  {
    key: 'jefe_ti',
    label: 'Jefe TI',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    description: 'Gestión y asignación global',
  },
  {
    key: 'tecnico',
    label: 'Técnico',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    description: 'Resolución de incidencias',
  },
  {
    key: 'usuario',
    label: 'Usuario',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    description: 'Reporte y seguimiento',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('usuario');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInputs) => {
    setErrorMessage(null);
    const result = await login(data.email, data.password, selectedRole);

    if (result.success && result.role) {
      const redirectRoutes: Record<UserRole, string> = {
        jefe_ti: '/dashboard/jefe-ti',
        tecnico: '/dashboard/tecnico',
        usuario: '/dashboard/usuario',
      };
      router.push(redirectRoutes[result.role] || '/dashboard');
    } else {
      setErrorMessage(result.error || 'Credenciales incorrectas (HTTP 401).');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
        
        {/* Cabecera */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">
            Sistema de Incidencias
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Selecciona tu perfil e ingresa tus credenciales de acceso
          </p>
        </div>

        {/* Pestañas de Selección de Rol */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Ingresar como:
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700">
            {roleOptions.map((role) => {
              const isSelected = selectedRole === role.key;
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role.key);
                    setErrorMessage(null);
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <svg
                    className={`h-5 w-5 mb-1 ${isSelected ? 'text-white' : 'text-slate-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={role.icon} />
                  </svg>
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alerta de Error 401 */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-center p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-sm"
          >
            <svg className="w-5 h-5 mr-3 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulario React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ejemplo@empresa.com"
              {...register('email', {
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Formato de correo inválido',
                },
              })}
              className={`mt-1.5 block w-full px-3 py-2.5 bg-slate-900 border ${
                errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
              } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Contraseña
            </label>
            <div className="mt-1.5 relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
                className={`block w-full px-3 py-2.5 bg-slate-900 border ${
                  errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-end">
            <Link href="/recuperar-password" className="text-sm font-medium text-blue-400 hover:text-blue-300">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-lg shadow-blue-600/30 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
          >
            {isSubmitting || loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

      </div>
    </div>
  );
}
