import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Headset } from 'lucide-react';
import { useSession } from '@/context/session';
import type { UserRole } from '@/types/roles';

const ROLES: UserRole[] = ['Jefe TI', 'Técnico', 'Usuario'];

const EMAIL_RULES: { test: (value: string) => boolean; message: string }[] = [
  { test: (value) => value.trim().length > 0, message: 'El correo electrónico es obligatorio.' },
  { test: (value) => value.includes('@'), message: 'El correo debe contener un "@".' },
];

const PASSWORD_RULES: { test: (value: string) => boolean; message: string }[] = [
  { test: (value) => value.length >= 8, message: 'La contraseña debe tener al menos 8 caracteres.' },
  { test: (value) => /[a-zA-Z]/.test(value), message: 'La contraseña debe contener al menos una letra.' },
  { test: (value) => /[A-Z]/.test(value), message: 'La contraseña debe contener al menos una mayúscula.' },
  { test: (value) => /[0-9]/.test(value), message: 'La contraseña debe contener al menos un número.' },
  {
    test: (value) => /[^a-zA-Z0-9]/.test(value),
    message: 'La contraseña debe contener al menos un carácter especial.',
  },
];

const collectErrors = (rules: typeof EMAIL_RULES, value: string) =>
  rules.filter((rule) => !rule.test(value)).map((rule) => rule.message);

export const LoginPage = () => {
  const { user, login } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState<UserRole>('Jefe TI');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = [
      ...collectErrors(EMAIL_RULES, email),
      ...collectErrors(PASSWORD_RULES, password),
    ];

    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    const from = (location.state as { from?: string } | null)?.from ?? '/';
    login(selectedRole);
    navigate(from, { replace: true });
  };

  if (user) return <Navigate to="/" replace />;

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

        {errors.length > 0 && (
          <div
            role="alert"
            className="mb-4 space-y-1 rounded-lg border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700"
          >
            {errors.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="rol" className="mb-2 block text-sm font-medium text-slate-700">
              Ingresar como
            </label>
            <div id="rol" className="flex w-full rounded-lg shadow-sm">
              {ROLES.map((role, index) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  aria-pressed={selectedRole === role}
                  className={`flex-1 py-2 text-sm font-medium transition-colors focus:z-10 ${
                    index === 0 ? 'rounded-l-lg' : ''
                  } ${index === ROLES.length - 1 ? 'rounded-r-lg' : ''} ${
                    index !== 0 ? '-ml-px' : ''
                  } ${
                    selectedRole === role
                      ? 'z-10 border border-blue-600 bg-blue-50 text-blue-700'
                      : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@empresa.pe"
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Mínimo 8 caracteres, con letra, mayúscula, número y símbolo.
            </p>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};
