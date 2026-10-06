import {
  ALL_CATEGORIES,
  KNOWLEDGE_FILTERS,
  type KnowledgeFilter,
} from '@/types/knowledge.types';

interface KnowledgeFiltersProps {
  activeFilter: KnowledgeFilter;
  onFilterChange: (filter: KnowledgeFilter) => void;
  counts: Record<KnowledgeFilter, number>;
}

export const KnowledgeFilters = ({
  activeFilter,
  onFilterChange,
  counts,
}: KnowledgeFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {KNOWLEDGE_FILTERS.map((filter) => {
        const isActive = filter === activeFilter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            aria-pressed={isActive}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>
              {filter === ALL_CATEGORIES ? 'Todos' : filter}
            </span>
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {counts[filter]}
            </span>
          </button>
        );
      })}
    </div>
  );
};