import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { SquarePen, ChevronDown, Check } from 'lucide-react';
import { BaseModal } from '../../../../components/modals';
import type { User, UserRole, UserStatus } from '../../types/user.types';

export interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave?: (updatedUser: User) => void;
}

interface EditFormData {
  nombre: string;
  apellido: string;
  correo: string;
  rol: UserRole;
  estado: UserStatus;
}

export const EditUserModal = ({
  isOpen,
  onClose,
  user,
  onSave,
}: EditUserModalProps) => {
  const [formData, setFormData] = useState<EditFormData>({
    nombre: '',
    apellido: '',
    correo: '',
    rol: 'Usuario',
    estado: 'Activo',
  });

  // Al abrir el modal o cambiar de usuario, pre-cargamos sus datos
  useEffect(() => {
    if (user) {
      const parts = user.name.split(' ');
      const nombre = parts[0] || '';
      const apellido = parts.slice(1).join(' ') || '';

      setFormData({
        nombre,
        apellido,
        correo: user.email,
        rol: user.role,
        estado: user.status,
      });
    }
  }, [user]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const fullName = `${formData.nombre} ${formData.apellido}`.trim();
    const initials = `${formData.nombre.charAt(0)}${formData.apellido.charAt(0)}`.toUpperCase() || user.avatarInitials;

    const updatedUser: User = {
      ...user,
      name: fullName,
      email: formData.correo,
      role: formData.rol,
      status: formData.estado,
      avatarInitials: initials,
    };

    onSave?.(updatedUser);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      {/* Cabecera del Modal */}
      <div className="flex items-center gap-2.5 pb-4">
        <div className="flex items-center justify-center text-blue-600">
          <SquarePen className="h-5 w-5 stroke-[2]" />
        </div>
        <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
          Editar Usuario
        </h2>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mt-2 space-y-4">
        {/* Fila 1: Nombre y Apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="edit-nombre"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Nombre
            </label>
            <input
              type="text"
              id="edit-nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
            />
          </div>

          <div>
            <label
              htmlFor="edit-apellido"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Apellido
            </label>
            <input
              type="text"
              id="edit-apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
            />
          </div>
        </div>

        {/* Fila 2: Correo */}
        <div>
          <label
            htmlFor="edit-correo"
            className="block text-xs font-semibold text-slate-600 mb-1.5"
          >
            Correo
          </label>
          <input
            type="email"
            id="edit-correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="correo@empresa.pe"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
          />
        </div>

        {/* Fila 3: Rol y Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="edit-rol"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Rol
            </label>
            <div className="relative">
              <select
                id="edit-rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150 cursor-pointer"
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
              htmlFor="edit-estado"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Estado
            </label>
            <div className="relative">
              <select
                id="edit-estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150 cursor-pointer"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <Check className="h-4 w-4 stroke-[2.5]" />
            <span>Guardar cambios</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
};
