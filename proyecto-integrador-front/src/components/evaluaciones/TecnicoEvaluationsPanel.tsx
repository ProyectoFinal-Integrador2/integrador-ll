import { StarRating } from '@/components/evaluaciones/StarRating';
import { formatearFecha } from '@/utils/date';
import type { Evaluacion } from '@/types/evaluation.types';

interface TecnicoEvaluationsPanelProps {
  evaluations: Evaluacion[];
}

export const TecnicoEvaluationsPanel = ({
  evaluations,
}: TecnicoEvaluationsPanelProps) => {
  return (
    <section className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
      <h3 className="mb-4 text-sm font-bold text-slate-800">
        Evaluaciones que recibi
      </h3>

      {evaluations.length === 0 ? (
        <p className="py-6 text-center text-xs text-slate-400">
          Todavia no recibiste evaluaciones de servicio.
        </p>
      ) : (
        <ul className="flex-1 divide-y divide-slate-100">
          {evaluations.map((evaluation) => (
            <li key={evaluation.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-slate-800">
                  #{evaluation.idTicket}
                </span>

                <StarRating rating={evaluation.puntuacion} />
              </div>

              <p className="mt-1.5 text-xs text-slate-600">
                {evaluation.comentario}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                {evaluation.evaluadorNombre} &middot;{' '}
                {formatearFecha(evaluation.creadoEn)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};