import { useEffect, useState } from 'react';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

/**
 * Carga un reporte al montar el componente. Las funciones de `reportsApi` son
 * estables, asi que el efecto no se repite en cada render.
 */
export const useReporte = <T,>(
  cargar: (signal?: AbortSignal) => Promise<T>,
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    cargar(controller.signal)
      .then((resultado) => {
        setData(resultado);
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
  }, [cargar]);

  return { data, isLoading, error };
};
