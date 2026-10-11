import { useEffect, useMemo, useState } from 'react';
import { EvaluationCard } from '@/components/evaluaciones/EvaluationCard';
import { EvaluationsToolbar } from '@/components/evaluaciones/EvaluationsToolbar';
import { MyEvaluationsView } from '@/components/evaluaciones/MyEvaluationsView';
import { obtenerEvaluaciones } from '@/services/evaluationsApi';
import { useSession } from '@/context/session';
import { normalizarParaBusqueda } from '@/utils/text';
import type { Evaluacion } from '@/types/evaluation.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const EvaluationsPage = () => {
  const { user } = useSession();

  if (user?.rol === 'Usuario') return <MyEvaluationsView />;

  return <AllEvaluationsView />;
};

const AllEvaluationsView = () => {
  const [evaluations, setEvaluations] = useState<Evaluacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    obtenerEvaluaciones(controller.signal)
      .then((data) => {
        setEvaluations(data);
        setError(null);
      })
      .catch((loadError: unknown) => {
        if (isAbortError(loadError)) return;
        setError(toMessage(loadError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);

    obtenerEvaluaciones()
      .then((data) => {
        setEvaluations(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  const visibleEvaluations = useMemo(() => {
    const query = normalizarParaBusqueda(searchTerm);
    if (query.length === 0) return evaluations;

    return evaluations.filter((evaluation) =>
      [
        evaluation.idTicket,
        evaluation.tecnicoNombre,
        evaluation.evaluadorNombre,
        evaluation.comentario,
      ]
        .map(normalizarParaBusqueda)
        .some((field) => field.includes(query)),
    );
  }, [evaluations, searchTerm]);

  const hasActiveSearch = normalizarParaBusqueda(searchTerm).length > 0;

  return (
    <div className="w-full">
      <EvaluationsToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
        >
          <p className="text-sm font-semibold text-red-700">
            No se pudieron cargar las evaluaciones
          </p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <p className="text-sm text-slate-500">Cargando evaluaciones...</p>
        </div>
      ) : visibleEvaluations.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <p className="text-sm font-semibold text-slate-700">
            {hasActiveSearch ? 'Sin coincidencias' : 'Sin evaluaciones'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {hasActiveSearch
              ? 'Ninguna evaluacion coincide con la busqueda.'
              : 'Todavia no se registro una evaluacion de servicio.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleEvaluations.map((evaluation) => (
            <EvaluationCard key={evaluation.id} evaluation={evaluation} />
          ))}
        </div>
      )}
    </div>
  );
};