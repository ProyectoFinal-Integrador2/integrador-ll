import { FILTROS_EQUIPO, type FiltroEquipo } from '@/types/equipment.types';

interface EquipmentFiltersProps {
  activeFilter: FiltroEquipo;
  onFilterChange: (filter: FiltroEquipo) => void;
  counts: Record<FiltroEquipo, number>;
}

const FILTER_LABELS: Record<FiltroEquipo, string> = {
  todos: 'Todos',
  Laptop: 'Laptops',
  Desktop: 'Desktops',
  Impresora: 'Impresoras',
  'En reparación': 'En reparación',
};

export const EquipmentFilters = ({
  activeFilter,
  onFilterChange,
  counts,
}: EquipmentFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTROS_EQUIPO.map((id) => {
        const isActive = activeFilter === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onFilterChange(id)}
            aria-pressed={isActive}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>{FILTER_LABELS[id]}</span>
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {counts[id]}
            </span>
          </button>
        );
      })}
    </div>
  );
};