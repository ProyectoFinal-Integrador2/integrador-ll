import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Users, X, ChevronDown, Check, Copy, KeyRound } from 'lucide-react';
import { BaseModal } from '@/components/common/BaseModal';
import type { CrearUsuarioInput, RolUsuario, UsuarioCreado } from '@/types/user.types';

export interface RegisterUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (input: CrearUsuarioInput) => Promise<UsuarioCreado>;
}

interface RegisterUserFormData {
  nombre: string;
  apellido: string;
  correo: string;
  rol: RolUsuario;
  area: string;
  fono: string;
}

const INITIAL_FORM_DATA: RegisterUserFormData = {
  nombre: '',
  apellido: '',
  correo: '',
  rol: 'Usuario',
  area: '',
  fono: '',
};

const toPayload = (form: RegisterUserFormData): CrearUsuarioInput => ({
  nombre: `${form.nombre} ${form.apellido}`.trim(),
  correo: form.correo.trim(),
  rol: form.rol,
  area: form.area.trim(),
  fono: form.fono.trim(),
});

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const RegisterUserModal = ({
  isOpen,
  onClose,
  onSubmit,
}: RegisterUserModalProps) => {
  const [formData, setFormData] = useState<RegisterUserFormData>(INITIAL_FORM_DATA);
  const [creado, setCreado] = useState<UsuarioCreado | null>(null);
  const [copiado, setCopiado] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'fono') {
      setFormData((prev) => ({ ...prev, fono: value.replace(/\D+/g, '').slice(0, 9) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    if (!/^\d{9}$/.test(formData.fono)) {
      setError('El teléfono debe tener exactamente 9 dígitos.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const resultado = await onSubmit(toPayload(formData));
      setCreado(resultado);
      setFormData(INITIAL_FORM_DATA);
    } catch (submitError) {
      setError(toMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopiar = async () => {
    if (!creado) return;
    try {
      await navigator.clipboard.writeText(creado.contrasenaGenerada);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setError('No se pudo copiar la contraseña.');
    }
  };

  const handleCerrar = () => {
    setCreado(null);
    setCopiado(false);
    setError(null);
    onClose();
  };

  const cerrarSinReiniciar = () => {
    setError(null);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={cerrarSinReiniciar} maxWidth="max-w-xl">
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
          onClick={cerrarSinReiniciar}
          disabled={isSaving}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 hover:rotate-90 cursor-pointer disabled:opacity-50"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {creado ? (
        <div className="mt-4">
          <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
              <KeyRound className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-green-800">
                Usuario registrado como {creado.usuario.nombre}
              </p>
              <p className="mt-1 text-xs text-green-700">
                Comparte esta contraseña temporal con el usuario. Deberá cambiarla
                en su primer ingreso.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Contraseña temporal
            </label>
            <div className="flex gap-2">
              <code className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-mono text-slate-800 select-all">
                {creado.contrasenaGenerada}
              </code>
              <button
                type="button"
                onClick={handleCopiar}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <Copy className="h-4 w-4" />
                {copiado ? 'Copiada' : 'Copiar'}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-3 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <div className="mt-8 flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCerrar}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              Aceptar
            </button>
          </div>
        </div>
      ) : (
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
              htmlFor="fono"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Teléfono *
            </label>
            <input
              type="tel"
              id="fono"
              name="fono"
              required
              minLength={9}
              maxLength={9}
              inputMode="numeric"
              pattern="[0-9]{9}"
              value={formData.fono}
              onChange={handleChange}
              placeholder="Ej. 999555123"
              title="Debe contener exactamente 9 dígitos"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Debe tener exactamente 9 dígitos. La contraseña se genera automáticamente y
              se mostrará al registrar. El usuario deberá cambiarla en su primer ingreso.
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
              onClick={cerrarSinReiniciar}
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
      )}
    </BaseModal>
  );
};