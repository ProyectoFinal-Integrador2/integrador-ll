import { StarRating } from '@/components/evaluaciones/StarRating';
import { formatearFecha } from '@/utils/date';
import type { Evaluacion } from '@/types/evaluation.types';

interface EvaluationCardProps {
  evaluation: Evaluacion;
}

export const EvaluationCard = ({ evaluation }: EvaluationCardProps) => {
  const { idTicket, tecnicoNombre, puntuacion, comentario, evaluadorNombre, creadoEn } =
    evaluation;

  return (
    <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-bold text-slate-800">#{idTicket}</span>
          <span className="truncate font-semibold text-slate-700">
            {tecnicoNombre}
          </span>
        </div>

        <div className="shrink-0">
          <StarRating rating={puntuacion} />
        </div>
      </div>

      <p className="mb-4 text-sm italic text-slate-500">{comentario}</p>

      <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
        <span>{evaluadorNombre}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{formatearFecha(creadoEn)}</span>
      </div>
    </article>
  );
};