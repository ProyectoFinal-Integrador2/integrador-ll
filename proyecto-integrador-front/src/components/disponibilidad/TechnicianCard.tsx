import { CalendarCheck } from 'lucide-react';
import { ESTILOS_AVATAR } from '@/utils/avatarStyles';
import { ESTILOS_ESTADO_TECNICO } from '@/components/disponibilidad/technicianStatusStyles';
import type { DisponibilidadTecnico } from '@/types/availability.types';

interface TechnicianCardProps {
  technician: DisponibilidadTecnico;
  onAsignarTurno?: (technician: DisponibilidadTecnico) => void;
}

export const TechnicianCard = ({
  technician,
  onAsignarTurno,
}: TechnicianCardProps) => {
  const { nombre, horario, ticketsActivos, estado, avatarIniciales, colorAvatar } =
    technician;

  return (
    <article className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
      <div>
        <div className="mb-6 flex items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm ${ESTILOS_AVATAR[colorAvatar]}`}
            aria-hidden="true"
          >
            {avatarIniciales}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-800">{nombre}</h3>
            <p className="truncate text-xs text-slate-400">{horario}</p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Tickets:{' '}
            <span className="font-bold text-slate-700">{ticketsActivos}</span>
          </p>

          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${ESTILOS_ESTADO_TECNICO[estado]}`}
              aria-hidden="true"
            />
            <span className="text-sm font-bold text-slate-800">{estado}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAsignarTurno?.(technician)}
        disabled={!onAsignarTurno}
        title={
          onAsignarTurno
            ? 'Asignar turno'
            : 'No tienes permiso para asignar el turno de este tecnico'
        }
        className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-semibold transition-all duration-150 ${
          onAsignarTurno
            ? 'cursor-pointer border-blue-300 bg-white text-blue-700 hover:bg-blue-50 active:scale-[0.98]'
            : 'cursor-not-allowed border-slate-300 text-slate-400'
        }`}
      >
        <CalendarCheck className="h-4 w-4" />
        Asignar turno
      </button>
    </article>
  );
};