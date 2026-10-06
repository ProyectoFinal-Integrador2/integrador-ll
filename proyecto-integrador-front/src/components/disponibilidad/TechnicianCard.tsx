import { CalendarCheck } from 'lucide-react';
import { AVATAR_STYLES } from '@/utils/avatarStyles';
import { TECHNICIAN_STATUS_STYLES } from '@/components/disponibilidad/technicianStatusStyles';
import type { TechnicianAvailability } from '@/types/availability.types';

interface TechnicianCardProps {
  technician: TechnicianAvailability;
}

export const TechnicianCard = ({ technician }: TechnicianCardProps) => {
  const { name, schedule, activeTickets, status, avatarInitials, avatarColor } =
    technician;

  return (
    <article className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
      <div>
        <div className="mb-6 flex items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm ${AVATAR_STYLES[avatarColor]}`}
            aria-hidden="true"
          >
            {avatarInitials}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-800">{name}</h3>
            <p className="truncate text-xs text-slate-400">{schedule}</p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Tickets:{' '}
            <span className="font-bold text-slate-700">{activeTickets}</span>
          </p>

          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${TECHNICIAN_STATUS_STYLES[status]}`}
              aria-hidden="true"
            />
            <span className="text-sm font-bold text-slate-800">{status}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled
        title="La asignacion de turnos todavia no esta disponible"
        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-400"
      >
        <CalendarCheck className="h-4 w-4" />
        Asignar turno
      </button>
    </article>
  );
};