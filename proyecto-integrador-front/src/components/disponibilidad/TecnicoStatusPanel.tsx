import { Link } from 'react-router-dom';
import { TECHNICIAN_STATUS_STYLES } from '@/constants/technicianStatusStyles';
import type { TechnicianAvailability } from '@/types/availability.types';

interface TecnicoStatusPanelProps {
  technician: TechnicianAvailability;
}

export const TecnicoStatusPanel = ({ technician }: TecnicoStatusPanelProps) => {
  return (
    <section className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-800">Mi disponibilidad</h3>

        <Link
          to="/disponibilidad"
          className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
        >
          Ver detalle &rarr;
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`h-4 w-4 rounded-full ${TECHNICIAN_STATUS_STYLES[technician.status]}`}
          aria-hidden="true"
        />

        <div>
          <p className="text-lg font-bold text-slate-800">{technician.status}</p>
          <p className="text-xs text-slate-400">{technician.schedule}</p>
        </div>
      </div>

      <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
        {technician.activeTickets === 0
          ? 'No tenes tickets activos en este momento.'
          : `Tenes ${technician.activeTickets} ticket${
              technician.activeTickets === 1 ? '' : 's'
            } activo${technician.activeTickets === 1 ? '' : 's'}.`}
      </p>
    </section>
  );
};