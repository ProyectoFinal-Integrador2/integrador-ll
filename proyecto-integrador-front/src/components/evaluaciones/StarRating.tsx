import { Star } from 'lucide-react';
import { EVALUATION_RATINGS, type EvaluationRating } from '@/types/evaluation.types';

interface StarRatingProps {
  rating: EvaluationRating;
}

/**
 * Las cinco estrellas se pintan siempre: las vacias en gris muestran de un
 * vistazo que la calificacion es sobre cinco y no sobre lo que se alcanzo a
 * dibujar. Va en su propio componente porque se reutiliza por cada fila.
 */
export const StarRating = ({ rating }: StarRatingProps) => {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${rating} de 5 estrellas`}
    >
      {EVALUATION_RATINGS.map((star) => (
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