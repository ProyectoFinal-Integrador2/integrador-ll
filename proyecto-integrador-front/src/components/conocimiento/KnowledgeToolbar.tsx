import { RefreshCw, Search } from 'lucide-react';

interface KnowledgeToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const KnowledgeToolbar = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  isLoading,
}: KnowledgeToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/** Buscador: filtra por titulo, autor y categoria. */}
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar articulo..."
          aria-label="Buscar articulo"
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        aria-label="Actualizar articulos"
        title="Actualizar articulos"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};