import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Check, Clock, X } from 'lucide-react';
import { BaseModal } from '@/components/common/BaseModal';
import {
  SLA_LEVELS,
  type SlaLevel,
  type SlaPriority,
  type SlaPriorityInput,
} from '@/types/sla.types';

export interface SlaPriorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** `null` = alta. Con un registro = edicion de ese SLA. */
  priority: SlaPriority | null;
  onSubmit?: (input: SlaPriorityInput) => Promise<void>;
}

interface SlaFormData {
  nivel: SlaLevel;
  descripcion: string;
  respuesta: string;
  resolucion: string;
  escalamiento: string;
}

/**
 * Arranca con valores propuestos en vez de vacio: casi todo SLA nuevo cae
 * cerca de un tiempo de 15 min de respuesta y 4 h de resolucion, y tener que
 * tipearlos cada vez es ruido. El campo igual es editable.
 */
const INITIAL_FORM_DATA: SlaFormData = {
  nivel: 'Crítico',
  descripcion: '',
  respuesta: '15',
  resolucion: '240',
  escalamiento: '30',
};

/**
 * Los minutos se editan como texto y se convierten al enviar. Si el estado
 * fuera `number`, no se podria vaciar el campo para escribir "120" desde cero:
 * React lo reinterpretaria como "" y el input se saltaria.
 */
const toFormData = (priority: SlaPriority | null): SlaFormData => {
  if (!priority) return INITIAL_FORM_DATA;

  return {
    nivel: priority.level,
    descripcion: priority.description,
    respuesta: String(priority.responseMinutes),
    resolucion: String(priority.resolutionMinutes),
    escalamiento: String(priority.escalationMinutes),
  };
};

const toPayload = (form: SlaFormData): SlaPriorityInput => ({
  level: form.nivel,
  description: form.descripcion.trim(),
  responseMinutes: Number(form.respuesta),
  resolutionMinutes: Number(form.resolucion),
  escalationMinutes: Number(form.escalamiento),
});

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

const LABEL_CLASS = 'block text-sm font-semibold text-slate-700 mb-1';
const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
const HINT_CLASS = 'mt-1 text-xs text-slate-400';

export const SlaPriorityModal = ({
  isOpen,
  onClose,
  priority,
  onSubmit,
}: SlaPriorityModalProps) => {
  const isEditing = priority !== null;

  // El padre cambia la `key` de este componente cuando cambia el registro o se
  // abre el modal, asi que el estado se vuelve a crear y el form arranca limpio.
  const [formData, setFormData] = useState<SlaFormData>(() =>
    toFormData(priority),
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Solo se leen `name` y `value`, asi que sirve para los tres campos.
  type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

  const handleChange = (e: ChangeEvent<FormField>) => {
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
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[550px]">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-800">
          <Clock className="h-6 w-6 stroke-2 text-blue-600" />
          <h2 className="text-xl font-bold">
            {isEditing ? 'Editar prioridad SLA' : 'Registrar prioridad SLA'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          aria-label="Cerrar modal"
          className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-50"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit}>
        {/* Nivel */}
        <div className="mb-4">
          <label htmlFor="sla-nivel" className={LABEL_CLASS}>
            Nivel *
          </label>
          <select
            id="sla-nivel"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            className={`${INPUT_CLASS} cursor-pointer appearance-none px-4 py-2.5`}
          >
            {SLA_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <p className={HINT_CLASS}>
            Se puede repetir un nivel si el compromiso es distinto.
          </p>
        </div>

        {/* Descripcion */}
        <div className="mb-6">
          <label htmlFor="sla-descripcion" className={LABEL_CLASS}>
            Descripcion *
          </label>
          <textarea
            id="sla-descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Que cubre este nivel de servicio"
            className={`${INPUT_CLASS} h-24 resize-none px-4 py-3`}
            required
          />
        </div>

        {/* Tiempos (3 columnas) */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="sla-respuesta" className={LABEL_CLASS}>
              Tiempo de respuesta
              <br />
              (min) *
            </label>
            <input
              type="number"
              id="sla-respuesta"
              name="respuesta"
              min={0}
              step={1}
              value={formData.respuesta}
              onChange={handleChange}
              className={`${INPUT_CLASS} px-4 py-2`}
              required
            />
            <p className={HINT_CLASS}>0 = inmediato</p>
          </div>

          <div>
            <label htmlFor="sla-resolucion" className={LABEL_CLASS}>
              Tiempo de resolucion
              <br />
              (min) *
            </label>
            <input
              type="number"
              id="sla-resolucion"
              name="resolucion"
              min={0}
              step={1}
              value={formData.resolucion}
              onChange={handleChange}
              className={`${INPUT_CLASS} px-4 py-2`}
              required
            />
            <p className={`${HINT_CLASS} leading-tight`}>
              Debe ser mayor al de
              <br />
              respuesta
            </p>
          </div>

          <div>
            <label htmlFor="sla-escalamiento" className={LABEL_CLASS}>
              Escalamiento (min) *
            </label>
            <input
              type="number"
              id="sla-escalamiento"
              name="escalamiento"
              min={0}
              step={1}
              value={formData.escalamiento}
              onChange={handleChange}
              className={`${INPUT_CLASS} px-4 py-2`}
              required
            />
            <p className={HINT_CLASS}>0 = escalar al instante</p>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 text-sm font-medium text-red-600"
          >
            {error}
          </p>
        )}

        {/* Botones de accion */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Check className="h-5 w-5 stroke-[2.5]" />
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};