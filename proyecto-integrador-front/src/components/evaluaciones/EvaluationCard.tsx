import { StarRating } from '@/components/evaluaciones/StarRating';
import { formatDate } from '@/utils/date';
import type { ServiceEvaluation } from '@/types/evaluation.types';

interface EvaluationCardProps {
  evaluation: ServiceEvaluation;
}

export const EvaluationCard = ({ evaluation }: EvaluationCardProps) => {
  const { ticketId, technicianName, rating, comment, reviewerName, createdAt } =
    evaluation;

  return (
    <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
      {/* Ticket, tecnico y calificacion */}
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-bold text-slate-800">#{ticketId}</span>
          <span className="truncate font-semibold text-slate-700">
            {technicianName}
          </span>
        </div>

        <div className="shrink-0">
          <StarRating rating={rating} />
        </div>
      </div>

      {/* Comentario */}
      <p className="mb-4 text-sm italic text-slate-500">{comment}</p>

      {/* Quien evaluo y cuando */}
      <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
        <span>{reviewerName}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{formatDate(createdAt)}</span>
      </div>
    </article>
  );
};