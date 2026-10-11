import { useEffect, useMemo, useState } from 'react';
import { SlaTable } from '@/components/sla/SlaTable';
import { SlaPriorityModal } from '@/components/sla/SlaPriorityModal';
import { SlaToolbar } from '@/components/sla/SlaToolbar';
import { crearSlaPrioridad, obtenerSlaPrioridades, actualizarSlaPrioridad } from '@/services/slasApi';
import { normalizarParaBusqueda } from '@/utils/text';
import { NIVELES_SLA, type SlaPrioridad, type EntradaSlaPrioridad } from '@/types/sla.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

const sortByUrgency = (priorities: SlaPrioridad[]): SlaPrioridad[] =>
  [...priorities].sort(
    (a, b) => NIVELES_SLA.indexOf(a.nivel) - NIVELES_SLA.indexOf(b.nivel),
  );

export const SlaPage = () => {
  const [priorities, setPriorities] = useState<SlaPrioridad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPriority, setSelectedPriority] = useState<SlaPrioridad | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
    const controller = new AbortController();

    obtenerSlaPrioridades(controller.signal)
      .then((data) => {
        setPriorities(data);
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

    obtenerSlaPrioridades()
      .then((data) => {
        setPriorities(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

const visiblePriorities = useMemo(() => {
  const query = normalizarParaBusqueda(searchTerm);
  if (query.length === 0) return priorities;

  return priorities.filter((priority) =>
    [priority.nivel, priority.descripcion]
      .map(normalizarParaBusqueda)
      .some((field) => field.includes(query)),
  );
}, [priorities, searchTerm]);

const handleCreate = async (input: EntradaSlaPrioridad) => {
    const created = await crearSlaPrioridad(input);
    setPriorities((prev) => sortByUrgency([...prev, created]));
  };

  const handleSave = async (input: EntradaSlaPrioridad) => {
    if (!selectedPriority) return;

    const updated = await actualizarSlaPrioridad(selectedPriority.id, input);
    setPriorities((prev) =>
      sortByUrgency(prev.map((p) => (p.id === updated.id ? updated : p))),
    );
  };

  const handleEditPriority = (priority: SlaPrioridad) => {
    setSelectedPriority(priority);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setSelectedPriority(null);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <SlaToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenNewSla={handleOpenNew}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <SlaTable
        priorities={visiblePriorities}
        onEditPriority={handleEditPriority}
        isLoading={isLoading}
        error={error}
        hasActiveSearch={normalizarParaBusqueda(searchTerm).length > 0}
      />

      <SlaPriorityModal
        key={`${selectedPriority?.id ?? 'nuevo'}-${isModalOpen}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        priority={selectedPriority}
        onSubmit={selectedPriority ? handleSave : handleCreate}
      />
    </div>
  );
};