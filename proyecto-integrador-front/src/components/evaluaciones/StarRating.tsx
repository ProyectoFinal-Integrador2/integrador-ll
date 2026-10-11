import { Star } from 'lucide-react';
import { PUNTUACIONES_EVALUACION, type PuntuacionEvaluacion } from '@/types/evaluation.types';

interface StarRatingProps {
  rating: PuntuacionEvaluacion;
}

export const StarRating = ({ rating }: StarRatingProps) => {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${rating} de 5 estrellas`}
    >
      {PUNTUACIONES_EVALUACION.map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 fill-current ${
            star <= rating ? 'text-yellow-400' : 'text-slate-300'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};