import { useEffect, useMemo, useState } from 'react';
import { EquipmentFilters } from '@/components/equipos/EquipmentFilters';
import { EquipmentList } from '@/components/equipos/EquipmentList';
import { EquipmentToolbar } from '@/components/equipos/EquipmentToolbar';
import { EditEquipmentModal } from '@/components/equipos/EditEquipmentModal';
import { RegisterEquipmentModal } from '@/components/equipos/RegisterEquipmentModal';
import { crearEquipo, obtenerEquipos, actualizarEquipo,} from '@/services/equipmentsApi';
import { normalizarParaBusqueda } from '@/utils/text';
import type { CrearEquipoInput, Equipo, FiltroEquipo, ActualizarEquipoInput,} from '@/types/equipment.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const EquipmentsPage = () => {
  const [equipments, setEquipments] = useState<Equipo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FiltroEquipo>('todos');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewEquipmentOpen, setIsNewEquipmentOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    obtenerEquipos(controller.signal)
      .then((data) => {
        setEquipments(data);
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

    obtenerEquipos()
      .then((data) => {
        setEquipments(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  const searched = useMemo(() => {
    const query = normalizarParaBusqueda(searchTerm);
    if (query.length === 0) return equipments;

    return equipments.filter((equipment) =>
      [equipment.codigo, equipment.nombre, equipment.area, equipment.tipo, equipment.estado]
        .map(normalizarParaBusqueda)
        .some((field) => field.includes(query)),
    );
  }, [equipments, searchTerm]);

  const counts = useMemo<Record<FiltroEquipo, number>>(
    () => ({
      todos: searched.length,
      Laptop: searched.filter((e) => e.tipo === 'Laptop').length,
      Desktop: searched.filter((e) => e.tipo === 'Desktop').length,
      Impresora: searched.filter((e) => e.tipo === 'Impresora').length,
      'En reparación': searched.filter((e) => e.estado === 'En reparación').length,
    }),
    [searched],
  );

  const visibleEquipments = useMemo(() => {
    if (activeFilter === 'todos') return searched;
    if (activeFilter === 'En reparación') {
      return searched.filter((e) => e.estado === 'En reparación');
    }

    return searched.filter((e) => e.tipo === activeFilter);
  }, [activeFilter, searched]);

  const handleEditEquipment = (equipment: Equipo) => {
    setSelectedEquipment(equipment);
    setIsEditModalOpen(true);
  };

  const handleCreate = async (input: CrearEquipoInput) => {
    const created = await crearEquipo(input);
    setEquipments((prev) =>
      [...prev, created].sort((a, b) => a.codigo.localeCompare(b.codigo)),
    );
  };

  const handleSave = async (input: ActualizarEquipoInput) => {
    if (!selectedEquipment) return;

    const updated = await actualizarEquipo(selectedEquipment.id, input);
    setEquipments((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e)),
    );
  };

  return (
    <div className="w-full">
      <EquipmentToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenNewEquipment={() => setIsNewEquipmentOpen(true)}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="mb-4">
        <EquipmentFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
      </div>

      <EquipmentList
        equipments={visibleEquipments}
        onEditEquipment={handleEditEquipment}
        isLoading={isLoading}
        error={error}
      />

      <RegisterEquipmentModal
        isOpen={isNewEquipmentOpen}
        onClose={() => setIsNewEquipmentOpen(false)}
        onSubmit={handleCreate}
      />

      <EditEquipmentModal
        key={`${selectedEquipment?.id ?? 'sin-seleccion'}-${isEditModalOpen}`}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        equipment={selectedEquipment}
        onSubmit={handleSave}
      />
    </div>
  );
};