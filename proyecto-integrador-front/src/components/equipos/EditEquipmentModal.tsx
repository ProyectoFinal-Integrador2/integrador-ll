import { useState, type ChangeEvent, type FormEvent } from 'react';
import { SquarePen, ChevronDown, Check } from 'lucide-react';
import { BaseModal } from '@/components/common/BaseModal';
import {
  EQUIPMENT_STATUSES,
  EQUIPMENT_TYPES,
  type Equipment,
  type EquipmentStatus,
  type EquipmentType,
  type UpdateEquipmentInput,
} from '@/types/equipment.types';

export interface EditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  onSubmit?: (input: UpdateEquipmentInput) => Promise<void>;
}

interface EditFormData {
  codigo: string;
  nombre: string;
  area: string;
  tipo: EquipmentType;
  estado: EquipmentStatus;
}

const EMPTY_FORM_DATA: EditFormData = {
  codigo: '',
  nombre: '',
  area: '',
  tipo: 'Laptop',
  estado: 'Operativo',
};

const toFormData = (equipment: Equipment | null): EditFormData => {
  if (!equipment) return EMPTY_FORM_DATA;

  return {
    codigo: equipment.code,
    nombre: equipment.name,
    area: equipment.area,
    tipo: equipment.type,
    estado: equipment.status,
  };
};

const toPayload = (form: EditFormData): UpdateEquipmentInput => ({
  code: form.codigo.trim(),
  name: form.nombre.trim(),
  area: form.area.trim(),
  type: form.tipo,
  status: form.estado,
});

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const EditEquipmentModal = ({
  isOpen,
  onClose,
  equipment,
  onSubmit,
}: EditEquipmentModalProps) => {
  const [formData, setFormData] = useState<EditFormData>(() =>
    toFormData(equipment),
  );

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
    if (!equipment || !onSubmit) return;

    setIsSaving(true);
    setError(null);

    try {
      await onSubmit(toPayload(formData));
      onClose();
    } catch (submitError) {
      setError(toMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      {/* Cabecera del Modal */}
      <div className="flex items-center gap-2.5 pb-4">
        <div className="flex items-center justify-center text-blue-600">
          <SquarePen className="h-5 w-5 stroke-2" />
        </div>
        <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
          Editar Equipo
        </h2>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mt-2 space-y-4">
        {/* Fila 1: Codigo */}
        <div>
          <label
            htmlFor="edit-eq-codigo"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Codigo de inventario *
          </label>
          <input
            type="text"
            id="edit-eq-codigo"
            name="codigo"
            required
            value={formData.codigo}
            onChange={handleChange}
            placeholder="LT-014"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-all duration-150 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="edit-eq-nombre"
              className="mb-1.5 block text-xs font-semibold text-slate-600"
            >
              Nombre / modelo *
            </label>
            <input
              type="text"
              id="edit-eq-nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder="HP ProBook 450 G9"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-all duration-150 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="edit-eq-area"
              className="mb-1.5 block text-xs font-semibold text-slate-600"
            >
              Area / Departamento *
            </label>
            <input
              type="text"
              id="edit-eq-area"
              name="area"
              required
              value={formData.area}
              onChange={handleChange}
              placeholder="Ej. Ventas"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-all duration-150 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="edit-eq-tipo"
              className="mb-1.5 block text-xs font-semibold text-slate-600"
            >
              Tipo
            </label>
            <div className="relative">
              <select
                id="edit-eq-tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-all duration-150 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {EQUIPMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-eq-estado"
              className="mb-1.5 block text-xs font-semibold text-slate-600"
            >
              Estado
            </label>
            <div className="relative">
              <select
                id="edit-eq-estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-all duration-150 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {EQUIPMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
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
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-6 py-2 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
          >
            <Check className="h-4 w-4 stroke-[2.5]" />
            <span>{isSaving ? 'Guardando...' : 'Guardar cambios'}</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
};