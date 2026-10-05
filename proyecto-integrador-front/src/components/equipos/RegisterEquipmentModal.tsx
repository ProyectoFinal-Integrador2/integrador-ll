import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Server, X, ChevronDown, Check } from 'lucide-react';
import { BaseModal } from '@/components/common/BaseModal';
import {
  EQUIPMENT_TYPES,
  type CreateEquipmentInput,
  type EquipmentType,
} from '@/types/equipment.types';

export interface RegisterEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (input: CreateEquipmentInput) => Promise<void>;
}

interface RegisterEquipmentFormData {
  codigo: string;
  nombre: string;
  area: string;
  tipo: EquipmentType;
}

const INITIAL_FORM_DATA: RegisterEquipmentFormData = {
  codigo: '',
  nombre: '',
  area: '',
  tipo: 'Laptop',
};

const toPayload = (form: RegisterEquipmentFormData): CreateEquipmentInput => ({
  code: form.codigo.trim(),
  name: form.nombre.trim(),
  area: form.area.trim(),
  type: form.tipo,
});

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const RegisterEquipmentModal = ({
  isOpen,
  onClose,
  onSubmit,
}: RegisterEquipmentModalProps) => {
  const [formData, setFormData] = useState<RegisterEquipmentFormData>(
    INITIAL_FORM_DATA,
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
    if (!onSubmit) return;

    setIsSaving(true);
    setError(null);

    try {
      await onSubmit(toPayload(formData));
      setFormData(INITIAL_FORM_DATA);
      onClose();
    } catch (submitError) {
      // El modal se mantiene abierto para que el usuario vea que fallo y
      // corrija sin volver a tipear todo.
      setError(toMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      {/* Cabecera del Modal */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-blue-600">
            <Server className="h-6 w-6 stroke-[2]" />
          </div>
          <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
            Registrar nuevo equipo
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 hover:rotate-90 disabled:opacity-50"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Fila 1: Codigo de inventario */}
        <div>
          <label
            htmlFor="eq-codigo"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Codigo de inventario *
          </label>
          <input
            type="text"
            id="eq-codigo"
            name="codigo"
            required
            value={formData.codigo}
            onChange={handleChange}
            placeholder="LT-014"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-colors placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Dos o tres letras, guion y numero. Ej. LT-014, DS-007.
          </p>
        </div>

        {/* Fila 2: Nombre y Area */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="eq-nombre"
              className="mb-1.5 block text-xs font-semibold text-slate-600"
            >
              Nombre / modelo *
            </label>
            <input
              type="text"
              id="eq-nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder="HP ProBook 450 G9"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-colors placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="eq-area"
              className="mb-1.5 block text-xs font-semibold text-slate-600"
            >
              Area / Departamento *
            </label>
            <input
              type="text"
              id="eq-area"
              name="area"
              required
              value={formData.area}
              onChange={handleChange}
              placeholder="Ej. Ventas"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-colors placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Fila 3: Tipo */}
        <div>
          <label
            htmlFor="eq-tipo"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Tipo *
          </label>
          <div className="relative">
            <select
              id="eq-tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

        {error && (
          <p role="alert" className="text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        {/* Botones de accion */}
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
            <span>{isSaving ? 'Registrando...' : 'Registrar equipo'}</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
};