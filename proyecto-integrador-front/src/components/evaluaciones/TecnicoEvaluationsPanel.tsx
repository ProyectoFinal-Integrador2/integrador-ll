import { StarRating } from '@/components/evaluaciones/StarRating';
import { formatDate } from '@/utils/date';
import type { ServiceEvaluation } from '@/types/evaluation.types';

interface TecnicoEvaluationsPanelProps {
  evaluations: ServiceEvaluation[];
}

/**
 * Las evaluaciones que recibio un tecnico.
 *
 * A diferencia de `EvaluationCard`, aqui no se repite el nombre del tecnico: en
 * esta pantalla el lector ya sabe de quien son, lo unico que aporta es el nombre
 * de quien evaluo.
 */
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
                  #{evaluation.ticketId}
                </span>

                <StarRating rating={evaluation.rating} />
              </div>

              <p className="mt-1.5 text-xs text-slate-600">
                {evaluation.comment}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                {evaluation.reviewerName} &middot;{' '}
                {formatDate(evaluation.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};