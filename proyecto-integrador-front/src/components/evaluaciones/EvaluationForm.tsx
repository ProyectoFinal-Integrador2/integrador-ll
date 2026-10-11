import { useState, type FormEvent } from 'react';
import { Loader2, Send } from 'lucide-react';
import { StarRatingInput } from '@/components/evaluaciones/StarRatingInput';
import { crearEvaluacion } from '@/services/evaluationsApi';
import { formatearFecha } from '@/utils/date';
import type { PuntuacionEvaluacion, Evaluacion } from '@/types/evaluation.types';
import type { Ticket } from '@/types/ticket.types';

interface EvaluationFormProps {
  ticket: Ticket;
  onSubmitted: (created: Evaluacion) => void;
}

export const EvaluationForm = ({ ticket, onSubmitted }: EvaluationFormProps) => {
  const [rating, setRating] = useState<PuntuacionEvaluacion | null>(null);
  const [comment, setComment] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (rating === null) return;

    setIsSending(true);
    setError(null);

    try {
      const created = await crearEvaluacion({
        idTicket: ticket.id,
        puntuacion: rating,
        comentario: comment,
      });
      onSubmitted(created);
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : 'No se pudo registrar la conformidad',
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-800">
        Ticket pendiente de evaluación
      </h3>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-400">#{ticket.id}</span>
          <span className="text-sm font-medium text-slate-800">
            {ticket.descripcion}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="rounded bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
            {ticket.estado}
          </span>
          <span className="text-slate-400">
            Técnico:{' '}
            {ticket.tecnicoNombre ?? 'sin asignar'}
          </span>
          <span className="text-slate-400">{formatearFecha(ticket.creadoEn)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset className="mb-6">
          <legend className="mb-2 text-sm font-medium text-slate-500">
            Califica la atención recibida
          </legend>

          <StarRatingInput
            value={rating}
            onChange={setRating}
            disabled={isSending}
          />

          <p className="mt-2 text-xs text-slate-400">
            {rating === null
              ? 'Elegí una cantidad de estrellas para habilitar el envío.'
              : `${rating} de 5 estrellas`}
          </p>
        </fieldset>

        <div className="mb-4">
          <label
            htmlFor={`comment-${ticket.id}`}
            className="mb-2 block text-sm font-medium text-slate-500"
          >
            Comentario (opcional)
          </label>
          <textarea
            id={`comment-${ticket.id}`}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={500}
            rows={3}
            placeholder="¿Cómo fue la atención del técnico?"
            className="h-24 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={rating === null || isSending}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors enabled:cursor-pointer enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Enviar evaluación
          </button>
        </div>
      </form>
    </div>
  );
};