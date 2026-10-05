import { Link } from 'react-router-dom';
import { TECHNICIAN_STATUS_STYLES } from '@/constants/technicianStatusStyles';
import type { TechnicianAvailability } from '@/types/availability.types';

interface TechnicianAvailabilityPanelProps {
  technicians: TechnicianAvailability[];
}

export const TechnicianAvailabilityPanel = ({
  technicians,
}: TechnicianAvailabilityPanelProps) => {
  return (
    <section className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-800">
          Disponibilidad de tecnicos
        </h3>

        <Link
          to="/disponibilidad"
          className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
        >
          Gestionar &rarr;
        </Link>
      </div>

      {technicians.length === 0 ? (
        <p className="py-6 text-center text-xs text-slate-400">
          No hay tecnicos activos.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {technicians.map((technician) => (
            <li
              key={technician.id}
              className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-100 bg-white p-3"
            >
              <span
                className={`h-3 w-3 rounded-full ${TECHNICIAN_STATUS_STYLES[technician.status]}`}
                aria-hidden="true"
              />
              <span className="text-center text-xs font-bold text-slate-800">
                {technician.name}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                {technician.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};