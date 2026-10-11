import { useState } from 'react';
import { Star } from 'lucide-react';
import { PUNTUACIONES_EVALUACION, type PuntuacionEvaluacion } from '@/types/evaluation.types';

interface StarRatingInputProps {
  value: PuntuacionEvaluacion | null;
  onChange: (rating: PuntuacionEvaluacion) => void;
  disabled?: boolean;
}

export const StarRatingInput = ({
  value,
  onChange,
  disabled = false,
}: StarRatingInputProps) => {
  const [hoveredRating, setHoveredRating] = useState<PuntuacionEvaluacion | null>(null);

  const visibleRating = hoveredRating ?? value ?? 0;

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Calificación">
      {PUNTUACIONES_EVALUACION.map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(null)}
          onFocus={() => setHoveredRating(star)}
          onBlur={() => setHoveredRating(null)}
          aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
          aria-pressed={value === star}
          className="cursor-pointer rounded p-0.5 transition-transform enabled:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Star
            aria-hidden="true"
            className={`h-8 w-8 fill-current ${
              star <= visibleRating ? 'text-yellow-400' : 'text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};