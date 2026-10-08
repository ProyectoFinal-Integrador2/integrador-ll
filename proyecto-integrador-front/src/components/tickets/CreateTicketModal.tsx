import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Check, ChevronDown, Ticket, X } from 'lucide-react';
import { BaseModal } from '@/components/common/BaseModal';
import { PRIORIDADES_TICKET, type CrearTicketInput, type PrioridadTicket } from '@/types/ticket.types';
import type { Equipo } from '@/types/equipment.types';
import { obtenerEquipos } from '@/services/equipmentsApi';

export interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: CrearTicketInput) => Promise<void>;
  solicitante?: { nombre: string; userId: string; area?: string } | null;
}

interface FormState {
  descripcion: string;
  solicitante: string;
  prioridad: PrioridadTicket;
  equipoId: string;
}

const INITIAL_FORM: FormState = {
  descripcion: '',
  solicitante: '',
  prioridad: 'Medio',
  equipoId: '',
};

export const CreateTicketModal = ({
  isOpen,
  onClose,
  onCreate,
  solicitante = null,
}: CreateTicketModalProps) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const userName = solicitante?.nombre ?? form.solicitante;
  const area = solicitante?.area ?? null;

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    obtenerEquipos(controller.signal)
      .then(setEquipos)
      .catch(() => setEquipos([]));

    return () => controller.abort();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM);
      setError(null);
    }
  }, [isOpen]);

  const equiposFiltrados = useMemo(() => {
    if (!area) return equipos;
    return equipos.filter((eq) => eq.area === area);
  }, [equipos, area]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onCreate({
        descripcion: form.descripcion,
        solicitante: userName,
        usuarioId: solicitante?.userId,
        equipoId: form.equipoId || undefined,
        prioridad: form.prioridad,
      });
      setForm(INITIAL_FORM);
      onClose();
    } catch (createError) {
      setError(
        createError instanceof Error ? createError.message : 'No se pudo crear el ticket',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-blue-600">
            <Ticket className="h-6 w-6 stroke-2" />
          </div>
          <h2 className="text-base font-bold tracking-tight text-slate-800 md:text-lg">
            Registrar ticket
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:rotate-90 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="descripcion" className="mb-1.5 block text-xs font-semibold text-slate-600">
            Descripcion *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Describe el problema (minimo 10 caracteres)"
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="solicitante" className="mb-1.5 block text-xs font-semibold text-slate-600">
              Usuario *
            </label>
            <input
              type="text"
              id="solicitante"
              name="solicitante"
              value={userName}
              onChange={handleChange}
              readOnly={solicitante !== null}
              placeholder="Nombre y apellido"
              className={`w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                solicitante !== null
                  ? 'cursor-not-allowed bg-slate-50 text-slate-500'
                  : ''
              }`}
            />
            {solicitante !== null && (
              <p className="mt-1 text-[11px] text-slate-400">
                El ticket se registra a tu nombre.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="prioridad" className="mb-1.5 block text-xs font-semibold text-slate-600">
              Prioridad *
            </label>
            <div className="relative">
              <select
                id="prioridad"
                name="prioridad"
                value={form.prioridad}
                onChange={handleChange}
                className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                {PRIORIDADES_TICKET.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="equipoId" className="mb-1.5 block text-xs font-semibold text-slate-600">
            Equipo asignado
          </label>
          <div className="relative max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white">
            <select
              id="equipoId"
              name="equipoId"
              value={form.equipoId}
              onChange={handleChange}
              className="w-full cursor-pointer appearance-none rounded-lg border-none bg-transparent px-3.5 py-2 text-xs text-slate-700 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Sin asignar</option>
              {equiposFiltrados.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.codigo} - {equipo.nombre}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          {area && equiposFiltrados.length === 0 && (
            <p className="mt-1 text-[11px] text-slate-400">
              No hay equipos registrados para el área {area}.
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-6 py-2 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4 stroke-[2.5]" />
            <span>{isSubmitting ? 'Registrando...' : 'Registrar ticket'}</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
};
