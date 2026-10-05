import type { TicketFilter } from '../types/ticket.types';

interface TicketFiltersProps {
  activeFilter: TicketFilter;
  onFilterChange: (filter: TicketFilter) => void;
  counts: Record<TicketFilter, number>;
}

const FILTERS: { id: TicketFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'abiertos', label: 'Abiertos' },
  { id: 'en-progreso', label: 'En progreso' },
  { id: 'cerrados', label: 'Cerrados' },
  { id: 'criticos', label: 'Críticos' },
];

export const TicketFilters = ({
  activeFilter,
  onFilterChange,
  counts,
}: TicketFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map(({ id, label }) => {
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
            <span>{label}</span>
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
