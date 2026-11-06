import { useEffect, useState, type FormEvent } from 'react';
import { ApiError } from '@/services/apiClient';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Headset } from 'lucide-react';
import { useSession } from '@/context/session';
import type { RolUsuario } from '@/types/roles';

const ROLES_LOGIN: RolUsuario[] = ['Jefe TI', 'Técnico', 'Usuario'];

const EMAIL_RULES: { test: (value: string) => boolean; message: string }[] = [
  { test: (value) => value.trim().length > 0, message: 'El correo electrónico es obligatorio.' },
  { test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), message: 'El correo no tiene un formato válido.' },
];

const collectErrors = (rules: typeof EMAIL_RULES, value: string) =>
  rules.filter((rule) => !rule.test(value)).map((rule) => rule.message);

export const LoginPage = () => {
  const { user, cargando, login } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [selectedRole, setSelectedRole] = useState<RolUsuario>('Jefe TI');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [avisos, setAvisos] = useState<Record<string, { mensaje: string; hasta?: number }>>({});
  const [ahora, setAhora] = useState(Date.now);
  const correoNormalizado = email.trim().toLowerCase();
  const aviso = avisos[correoNormalizado];
  const segundos = aviso?.hasta ? Math.max(0, Math.ceil((aviso.hasta - ahora) / 1000)) : 0;
  const bloqueado = segundos > 0;

  useEffect(() => {
    if (!aviso?.hasta) return;
    const timer = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [aviso?.hasta]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || bloqueado) return;
    const correoEnviado = correoNormalizado;

    const nextErrors = collectErrors(EMAIL_RULES, email);

    if (password.length === 0) {
      nextErrors.push('La contraseña es obligatoria.');
    }

    setErrors(nextErrors);
    setErrorServidor(null);
    if (nextErrors.length > 0) return;

    setIsSubmitting(true);

    try {
      await login(email.trim(), password, selectedRole);
      navigate(from, { replace: true });
    } catch (submitError) {
      if (submitError instanceof ApiError && submitError.intentosRestantes !== undefined) {
        const restantes = submitError.intentosRestantes;
        setAhora(Date.now());
        setAvisos((prev) => ({ ...prev, [correoEnviado]: {
          mensaje: `${submitError.message}${restantes > 0 ? ` Te quedan ${restantes} ${restantes === 1 ? 'intento' : 'intentos'}.` : ''}`,
          hasta: submitError.segundosRestantes ? Date.now() + submitError.segundosRestantes * 1000 : undefined,
        } }));
        return;
      }
      setErrorServidor(
        submitError instanceof Error ? submitError.message : 'No se pudo iniciar sesión.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cargando && user) return <Navigate to={from} replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eaecf0] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Headset className="h-8 w-8" />
          </div>
          <h1 className="mb-1 text-2xl font-bold text-slate-800">Help Desk TI</h1>
          <p className="text-sm text-slate-500">Inicia sesión para continuar</p>
        </div>

        {(errors.length > 0 || errorServidor) && (
          <div
            role="alert"
            className="mb-4 space-y-1 rounded-lg border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700"
          >
            {errors.map((message) => (
              <p key={message}>{message}</p>
            ))}
            {errorServidor && <p>{errorServidor}</p>}
          </div>
        )}

        {aviso && (!aviso.hasta || bloqueado) && (
          <div role="alert" className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            <p>{aviso.mensaje}</p>
            {bloqueado && <p>Espera {Math.floor(segundos / 60).toString().padStart(2, '0')}:{(segundos % 60).toString().padStart(2, '0')} para volver a intentar con este correo.</p>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Ingresar como</label>
            <div className="flex gap-2">
              {ROLES_LOGIN.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
                    selectedRole === role
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorServidor(null); setErrors([]); setAhora(Date.now()); }}
              placeholder="correo@empresa.pe"
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || bloqueado}
            className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Verificando...' : bloqueado ? 'Correo bloqueado temporalmente' : 'Iniciar sesión'}
          </button>
        </form>

                <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowForgot((value) => !value)}
            className="text-xs font-medium text-blue-500 hover:text-blue-700 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>

          {showForgot && (
            <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
              Comunícate con el Jefe de TI para que restablezca tu contraseña. Te entregará una
              contraseña temporal y el sistema te pedirá cambiarla al ingresar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
