import { useEffect, useMemo, useState } from 'react';
import { AvailabilityToolbar } from '@/components/disponibilidad/AvailabilityToolbar';
import { TechnicianCard } from '@/components/disponibilidad/TechnicianCard';
import { fetchTechnicianAvailability } from '@/services/availabilityApi';
import { normalizeForSearch } from '@/utils/text';
import type { TechnicianAvailability } from '@/types/availability.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const AvailabilityPage = () => {
  const [technicians, setTechnicians] = useState<TechnicianAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Los setState van dentro de los callbacks de la promesa, nunca en el cuerpo
   * del efecto: llamarlos de forma sincrona ahi provoca renders en cascada.
   */
  useEffect(() => {
    const controller = new AbortController();

    fetchTechnicianAvailability(controller.signal)
      .then((data) => {
        setTechnicians(data);
        setError(null);
      })
      .catch((loadError: unknown) => {
        // Un abort es lo normal al desmontar o recargar: no es un fallo que mostrar.
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

    fetchTechnicianAvailability()
      .then((data) => {
        setTechnicians(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  const visibleTechnicians = useMemo(() => {
    const query = normalizeForSearch(searchTerm);
    if (query.length === 0) return technicians;

    return technicians.filter((technician) =>
      [technician.name, technician.schedule]
        .map(normalizeForSearch)
        .some((field) => field.includes(query)),
    );
  }, [technicians, searchTerm]);

  const hasActiveSearch = normalizeForSearch(searchTerm).length > 0;

  return (
    <div className="w-full">
      <AvailabilityToolbar
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
            No se pudo cargar la disponibilidad
          </p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <p className="text-sm text-slate-500">Cargando disponibilidad...</p>
        </div>
      ) : visibleTechnicians.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <p className="text-sm font-semibold text-slate-700">
            {hasActiveSearch ? 'Sin coincidencias' : 'Sin tecnicos activos'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {hasActiveSearch
              ? 'Ningun tecnico coincide con la busqueda.'
              : 'No hay usuarios con rol Tecnico y estado Activo.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleTechnicians.map((technician) => (
            <TechnicianCard key={technician.id} technician={technician} />
          ))}
        </div>
      )}
    </div>
  );
};