import { Link } from 'react-router-dom';
import { SlaLevelBadge } from '@/components/sla/SlaLevelBadge';
import { formatMinutes } from '@/utils/slaTime';
import type { SlaPriority } from '@/types/sla.types';

interface SlaCommitmentPanelProps {
  sla: SlaPriority[];
}

/**
 * Muestra el SLA **configurado**, no el cumplimiento.
 *
 * El cumplimiento necesita saber cuando se respondio y quando se resolvio cada
 * ticket, y `Ticket` solo tiene `createdAt`: no hay con que calcularlo. Poner un
 * porcentaje aca seria inventar el dato. Cuando existan esas marcas, esta misma
 * fila pasa a mostrar el porcentaje real sin cambiar el resto de la pantalla.
 */
export const SlaCommitmentPanel = ({ sla }: SlaCommitmentPanelProps) => {
  return (
    <section className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-800">
          SLA comprometido por nivel
        </h3>

        <Link
          to="/prioridades-sla"
          className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
        >
          Configurar &rarr;
        </Link>
      </div>

      {sla.length === 0 ? (
        <p className="py-6 text-center text-xs text-slate-400">
          Todavia no se configuro ningun nivel de servicio.
        </p>
      ) : (
        <ul className="space-y-3">
          {sla.map((priority) => (
            <li key={priority.id} className="flex items-center gap-3">
              <SlaLevelBadge level={priority.level} />

              <dl className="flex flex-1 items-center justify-end gap-5 text-xs">
                <div className="text-right">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Respuesta
                  </dt>
                  <dd className="font-bold text-slate-700">
                    {formatMinutes(priority.responseMinutes)}
                  </dd>
                </div>

                <div className="text-right">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Resolucion
                  </dt>
                  <dd className="font-bold text-slate-700">
                    {formatMinutes(priority.resolutionMinutes)}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};