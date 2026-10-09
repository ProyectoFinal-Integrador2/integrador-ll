import { useState, type FormEvent } from 'react';
import { CalendarCheck, Check, X } from 'lucide-react';
import { BaseModal } from '@/components/common/BaseModal';
import {
  BLOQUES_HORARIOS,
  construirHorario,
  DIAS_SEMANA,
  type BloqueHorarioId,
  type DiaSemana,
} from '@/utils/horario';
import type {
  DisponibilidadTecnico,
  EntradaDisponibilidad,
} from '@/types/availability.types';

export interface AsignarTurnoModalProps {
  isOpen: boolean;
  tecnico: DisponibilidadTecnico | null;
  onClose: () => void;
  onSubmit?: (input: EntradaDisponibilidad) => Promise<void>;
}

const MAX_LONGITUD_HORARIO = 60;

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

const CHIP_CLASS = (activo: boolean): string =>
  `cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
    activo
      ? 'border-blue-600 bg-blue-600 text-white'
      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  }`;

const alternar = <T,>(lista: T[], valor: T): T[] =>
  lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor];

export const AsignarTurnoModal = ({
  isOpen,
  tecnico,
  onClose,
  onSubmit,
}: AsignarTurnoModalProps) => {
  const [dias, setDias] = useState<DiaSemana[]>([]);
  const [bloques, setBloques] = useState<BloqueHorarioId[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const horarioGenerado = construirHorario(dias, bloques);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!onSubmit || !tecnico) return;

    if (dias.length === 0 || bloques.length === 0) {
      setError('Selecciona al menos un dia y un bloque de horas.');
      return;
    }

    if (horarioGenerado.length > MAX_LONGITUD_HORARIO) {
      setError(
        `El horario no puede superar ${MAX_LONGITUD_HORARIO} caracteres.`,
      );
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSubmit({ tecnicoId: tecnico.id, horario: horarioGenerado });
      setDias([]);
      setBloques([]);
      onClose();
    } catch (submitError) {
      setError(toMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-blue-600">
            <CalendarCheck className="h-6 w-6 stroke-2" />
          </div>
          <h2 className="text-base font-bold tracking-tight text-slate-800 md:text-lg">
            Asignar turno
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:rotate-90 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {tecnico ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Tecnico
            </label>
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-800">
              {tecnico.nombre}
            </p>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              Dias *
            </span>
            <div className="flex flex-wrap gap-2">
              {DIAS_SEMANA.map((dia) => (
                <button
                  key={dia}
                  type="button"
                  onClick={() => setDias((prev) => alternar(prev, dia))}
                  aria-pressed={dias.includes(dia)}
                  className={CHIP_CLASS(dias.includes(dia))}
                >
                  {dia}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              Horas *
            </span>
            <div className="flex flex-wrap gap-2">
              {BLOQUES_HORARIOS.map((bloque) => (
                <button
                  key={bloque.id}
                  type="button"
                  onClick={() =>
                    setBloques((prev) => alternar(prev, bloque.id))
                  }
                  aria-pressed={bloques.includes(bloque.id)}
                  className={CHIP_CLASS(bloques.includes(bloque.id))}
                >
                  {bloque.etiqueta}
                </button>
              ))}
            </div>
          </div>

          {horarioGenerado.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Horario que se guardara
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">
                {horarioGenerado}
              </p>
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
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
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>{isSaving ? 'Guardando...' : 'Guardar horario'}</span>
            </button>
          </div>
        </form>
      ) : null}
    </BaseModal>
  );
};