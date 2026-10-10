import { Link } from 'react-router-dom';
import { SlaLevelBadge } from '@/components/sla/SlaLevelBadge';
import { formatearMinutos } from '@/utils/slaTime';
import type { SlaPrioridad } from '@/types/sla.types';

interface SlaCommitmentPanelProps {
  sla: SlaPrioridad[];
}

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
              <SlaLevelBadge level={priority.nivel} />

              <dl className="flex flex-1 items-center justify-end gap-5 text-xs">
                <div className="text-right">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Respuesta
                  </dt>
                  <dd className="font-bold text-slate-700">
                    {formatearMinutos(priority.minutosRespuesta)}
                  </dd>
                </div>

                <div className="text-right">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Resolucion
                  </dt>
                  <dd className="font-bold text-slate-700">
                    {formatearMinutos(priority.minutosResolucion)}
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