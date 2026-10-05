import { CalendarCheck } from 'lucide-react';
import { AVATAR_STYLES } from '@/constants/avatarStyles';
import { TECHNICIAN_STATUS_STYLES } from '@/constants/technicianStatusStyles';
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
        {/* Identidad del tecnico */}
        <div className="mb-6 flex items-center gap-4">
          {/**
           * El color del avatar sale del rol (verde para tecnicos) en vez de
           * fijarse en la tarjeta: asi se ve igual que en la lista de usuarios.
           */}
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

        {/* Tickets y estado */}
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

      {/**
       * Deshabilitado a proposito: no hay modulo de turnos todavia, asi que no
       * hay nada a lo que asignar. Queda visible para que se vea de donde sale
       * la accion cuando exista, en vez de aparecer sola cuando se programe.
       */}
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