import { useEffect, useMemo, useState } from 'react';
import { SlaTable } from '@/components/sla/SlaTable';
import { SlaPriorityModal } from '@/components/sla/SlaPriorityModal';
import { SlaToolbar } from '@/components/sla/SlaToolbar';
import { createSlaPriority, fetchSlaPriorities, updateSlaPriority } from '@/services/slasApi';
import { normalizeForSearch } from '@/utils/text';
import { SLA_LEVELS, type SlaPriority, type SlaPriorityInput } from '@/types/sla.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

const sortByUrgency = (priorities: SlaPriority[]): SlaPriority[] =>
  [...priorities].sort(
    (a, b) => SLA_LEVELS.indexOf(a.level) - SLA_LEVELS.indexOf(b.level),
  );

export const SlaPage = () => {
  const [priorities, setPriorities] = useState<SlaPriority[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPriority, setSelectedPriority] = useState<SlaPriority | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
    const controller = new AbortController();

    fetchSlaPriorities(controller.signal)
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

    fetchSlaPriorities()
      .then((data) => {
        setPriorities(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

const visiblePriorities = useMemo(() => {
  const query = normalizeForSearch(searchTerm);
  if (query.length === 0) return priorities;

  return priorities.filter((priority) =>
    [priority.level, priority.description]
      .map(normalizeForSearch)
      .some((field) => field.includes(query)),
  );
}, [priorities, searchTerm]);

const handleCreate = async (input: SlaPriorityInput) => {
    const created = await createSlaPriority(input);
    setPriorities((prev) => sortByUrgency([...prev, created]));
  };

  const handleSave = async (input: SlaPriorityInput) => {
    if (!selectedPriority) return;

    const updated = await updateSlaPriority(selectedPriority.id, input);
    setPriorities((prev) =>
      sortByUrgency(prev.map((p) => (p.id === updated.id ? updated : p))),
    );
  };

  const handleEditPriority = (priority: SlaPriority) => {
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
        hasActiveSearch={normalizeForSearch(searchTerm).length > 0}
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