import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Users, X, ChevronDown, Check } from 'lucide-react';
import { BaseModal } from '@/components/common/BaseModal';
import type { CrearUsuarioInput, RolUsuario } from '@/types/user.types';

export interface RegisterUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (input: CrearUsuarioInput) => Promise<void>;
}

interface RegisterUserFormData {
  nombre: string;
  apellido: string;
  correo: string;
  rol: RolUsuario;
  area: string;
  contrasena: string;
}

const INITIAL_FORM_DATA: RegisterUserFormData = {
  nombre: '',
  apellido: '',
  correo: '',
  rol: 'Usuario',
  area: '',
  contrasena: '',
};

const toPayload = (form: RegisterUserFormData): CrearUsuarioInput => ({
  nombre: `${form.nombre} ${form.apellido}`.trim(),
  correo: form.correo.trim(),
  rol: form.rol,
  area: form.area.trim(),
  contrasena: form.contrasena,
});

const REGLAS_CONTRASENA: { test: (value: string) => boolean; message: string }[] = [
  { test: (value) => value.length >= 8, message: 'La contraseña debe tener al menos 8 caracteres.' },
  { test: (value) => /[a-zA-Z]/.test(value), message: 'La contraseña debe contener una letra.' },
  { test: (value) => /[A-Z]/.test(value), message: 'La contraseña debe contener una mayúscula.' },
  { test: (value) => /[0-9]/.test(value), message: 'La contraseña debe contener un número.' },
  { test: (value) => /[^a-zA-Z0-9]/.test(value), message: 'La contraseña debe contener un carácter especial.' },
];

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const RegisterUserModal = ({
  isOpen,
  onClose,
  onSubmit,
}: RegisterUserModalProps) => {
  const [formData, setFormData] = useState<RegisterUserFormData>(INITIAL_FORM_DATA);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    const fallas = REGLAS_CONTRASENA.filter((rule) => !rule.test(formData.contrasena)).map(
      (rule) => rule.message,
    );

    if (fallas.length > 0) {
      setError(fallas[0]);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSubmit(toPayload(formData));
      setFormData(INITIAL_FORM_DATA);
      onClose();
    } catch (submitError) {
      setError(toMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-blue-600">
            <Users className="h-6 w-6 stroke-2" />
          </div>
          <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
            Registrar nuevo usuario
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 hover:rotate-90 cursor-pointer disabled:opacity-50"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="apellido"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Apellido *
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              required
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="correo"
            className="block text-xs font-semibold text-slate-600 mb-1.5"
          >
            Correo corporativo *
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            required
            value={formData.correo}
            onChange={handleChange}
            placeholder="usuario@empresa.pe"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="rol"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Rol *
            </label>
            <div className="relative">
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                <option value="Usuario">Usuario</option>
                <option value="Técnico">Técnico</option>
                <option value="Jefe TI">Jefe TI</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label
              htmlFor="area"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Área / Departamento *
            </label>
            <input
              type="text"
              id="area"
              name="area"
              required
              value={formData.area}
              onChange={handleChange}
              placeholder="Ej. Ventas"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contrasena"
            className="block text-xs font-semibold text-slate-600 mb-1.5"
          >
            Contraseña inicial *
          </label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            required
            value={formData.contrasena}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <p className="mt-1 text-[10px] text-slate-400">
            Mínimo 8 caracteres, con letra, mayúscula, número y símbolo. El usuario podrá
            cambiarla después desde su perfil.
          </p>
        </div>

        {error && (
          <p role="alert" className="text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-50"
          >
            <Check className="h-4 w-4 stroke-[2.5]" />
            <span>{isSaving ? 'Registrando...' : 'Registrar usuario'}</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
};