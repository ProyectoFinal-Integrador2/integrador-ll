import { useState } from 'react';
import { Star } from 'lucide-react';
import { EVALUATION_RATINGS, type EvaluationRating } from '@/types/evaluation.types';

interface StarRatingInputProps {
  /** `null` mientras no se eligio ninguna: es la razon de estar apagado el boton. */
  value: EvaluationRating | null;
  onChange: (rating: EvaluationRating) => void;
  disabled?: boolean;
}

/**
 * Las cinco estrellas de `StarRating`, pero escriben en vez de mostrar.
 *
 * Separa `hoveredRating` de `value` a proposito: si el relleno leyera el valor
 * real, al pasar el mouse se verian las estrellas encendidas y al salir se
 * apagarian de golpe, dando la sensacion de que se desmarco la calificacion.
 *
 * Se puede usar con teclado porque cada estrella es un boton: el foco y el
 * tabulador los da el navegador, y con cinco opciones las flechas no aportan.
 */
export const StarRatingInput = ({
  value,
  onChange,
  disabled = false,
}: StarRatingInputProps) => {
  const [hoveredRating, setHoveredRating] = useState<EvaluationRating | null>(null);

  // Al salir el mouse sin haber elegido nada se vuelve al valor guardado.
  const visibleRating = hoveredRating ?? value ?? 0;

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Calificación">
      {EVALUATION_RATINGS.map((star) => (
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