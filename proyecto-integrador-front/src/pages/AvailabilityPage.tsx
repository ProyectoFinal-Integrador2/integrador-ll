import { useEffect, useMemo, useState } from 'react';
import { AvailabilityToolbar } from '@/components/disponibilidad/AvailabilityToolbar';
import { TechnicianCard } from '@/components/disponibilidad/TechnicianCard';
import { AsignarTurnoModal } from '@/components/disponibilidad/AsignarTurnoModal';
import { obtenerDisponibilidadTecnicos, registrarDisponibilidad } from '@/services/availabilityApi';
import { useSession } from '@/context/session';
import { normalizarParaBusqueda } from '@/utils/text';
import type { DisponibilidadTecnico, EntradaDisponibilidad } from '@/types/availability.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const AvailabilityPage = () => {
  const { user } = useSession();
  const [technicians, setTechnicians] = useState<DisponibilidadTecnico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnician, setSelectedTechnician] =
    useState<DisponibilidadTecnico | null>(null);
  const [isTurnoModalOpen, setIsTurnoModalOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    obtenerDisponibilidadTecnicos(controller.signal)
      .then((data) => {
        setTechnicians(data);
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

    obtenerDisponibilidadTecnicos()
      .then((data) => {
        setTechnicians(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  const visibleTechnicians = useMemo(() => {
    const query = normalizarParaBusqueda(searchTerm);
    if (query.length === 0) return technicians;

    return technicians.filter((technician) =>
      [technician.nombre, technician.horario]
        .map(normalizarParaBusqueda)
        .some((field) => field.includes(query)),
    );
  }, [technicians, searchTerm]);

  const hasActiveSearch = normalizarParaBusqueda(searchTerm).length > 0;

  const puedeAsignarTurno = (technician: DisponibilidadTecnico): boolean =>
    user?.rol === 'Jefe TI' ||
    (user?.rol === 'Técnico' && user.id === technician.id);

  const handleAsignarTurno = (technician: DisponibilidadTecnico) => {
    setSelectedTechnician(technician);
    setIsTurnoModalOpen(true);
  };

  const handleSaveTurno = async (input: EntradaDisponibilidad) => {
    await registrarDisponibilidad(input);
    await handleRefresh();
  };

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
            <TechnicianCard
              key={technician.id}
              technician={technician}
              onAsignarTurno={
                puedeAsignarTurno(technician) ? handleAsignarTurno : undefined
              }
            />
          ))}
        </div>
      )}

      <AsignarTurnoModal
        key={`${selectedTechnician?.id ?? 'sin-seleccion'}-${isTurnoModalOpen}`}
        isOpen={isTurnoModalOpen}
        tecnico={selectedTechnician}
        onClose={() => setIsTurnoModalOpen(false)}
        onSubmit={handleSaveTurno}
      />
    </div>
  );
};