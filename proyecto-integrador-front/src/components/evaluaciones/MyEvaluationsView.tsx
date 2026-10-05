import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { EvaluationCard } from '@/components/evaluaciones/EvaluationCard';
import { EvaluationForm } from '@/components/evaluaciones/EvaluationForm';
import {
  fetchPendingEvaluations,
  fetchServiceEvaluations,
} from '@/services/evaluationsApi';
import { useSession } from '@/context/session';
import type { ServiceEvaluation } from '@/types/evaluation.types';
import type { Ticket } from '@/types/ticket.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

/** El modal manda el ticket a evaluar por `state` de react-router. */
interface EvaluateLocationState {
  ticketId?: string;
}

export const MyEvaluationsView = () => {
  const { user } = useSession();
  const location = useLocation();
  const targetTicketId = (location.state as EvaluateLocationState | null)?.ticketId;

  const [pending, setPending] = useState<Ticket[]>([]);
  const [mine, setMine] = useState<ServiceEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Los pendientes y las conformidades ya dadas son dos preguntas distintas al
   * back, asi que se piden en paralelo y se espera a las dos con un unico
   * `isLoading`.
   */
  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();

    Promise.all([
      fetchPendingEvaluations(user.id, controller.signal),
      fetchServiceEvaluations(controller.signal),
    ])
      .then(([pendingTickets, evaluations]) => {
        setPending(pendingTickets);
        // Solo las suyas: el listado completo es del Jefe TI.
        setMine(
          evaluations.filter((evaluation) => evaluation.reviewerId === user.id),
        );
        setError(null);
      })
      .catch((loadError: unknown) => {
        // Un abort es lo normal al desmontar: no es un fallo que mostrar.
        if (isAbortError(loadError)) return;
        setError(toMessage(loadError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [user]);

  /**
   * El ticket deja de estar pendiente y su conformidad entra al historial. Se
   * parchea el estado con lo que devolvio el back: la evaluacion ya esta
   * creada, asi que volver a listar solo seria un request de mas.
   */
  const handleSubmitted = (created: ServiceEvaluation) => {
    setPending((prev) => prev.filter((ticket) => ticket.id !== created.ticketId));
    setMine((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
  };

  /**
   * El ticket que llega desde "Dar conformidad" se muestra primero: si el
   * usuario venia con la intencion de calificar ese ticket en concreto, no
   * deberia tener que buscarlo en la lista.
   */
  const orderedPending = useMemo(() => {
    if (targetTicketId === undefined) return pending;

    return [...pending].sort((a, b) => {
      if (a.id === targetTicketId) return -1;
      if (b.id === targetTicketId) return 1;
      return 0;
    });
  }, [pending, targetTicketId]);

  if (!user) return null;

  return (
    <div className="w-full">
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-center"
        >
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <p className="text-sm text-slate-500">Cargando conformity...</p>
        </div>
      ) : (
        <>
          {orderedPending.map((ticket) => (
            <EvaluationForm
              key={ticket.id}
              ticket={ticket}
              onSubmitted={handleSubmitted}
            />
          ))}

          {pending.length === 0 && (
            <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
              <p className="text-sm font-semibold text-slate-700">
                No tenés tickets pendientes de evaluar
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Cuando un ticket tuyo pase a Cerrado vas a poder calificar la
                atención que recibiste.
              </p>
            </div>
          )}
        </>
      )}

      <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-800">
        Conformidades que registraste
      </h2>

      {!isLoading &&
        (mine.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
            <p className="text-sm font-semibold text-slate-700">
              Todavia no diste conformidad a ningun ticket
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {mine.map((evaluation) => (
              <EvaluationCard key={evaluation.id} evaluation={evaluation} />
            ))}
          </div>
        ))}
    </div>
  );
};