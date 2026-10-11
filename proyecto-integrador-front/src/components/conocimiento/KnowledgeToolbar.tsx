import { Plus, RefreshCw, Search } from 'lucide-react';
import { useSession } from '@/context/session';

interface KnowledgeToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onOpenNewArticle: () => void;
  isLoading: boolean;
}

export const KnowledgeToolbar = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  onOpenNewArticle,
  isLoading,
}: KnowledgeToolbarProps) => {
  const { user } = useSession();
  const puedeRegistrar = user?.rol === 'Jefe TI' || user?.rol === 'Técnico';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
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

      <div className="flex items-center gap-2">
        {puedeRegistrar && (
          <button
            type="button"
            onClick={onOpenNewArticle}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            Nuevo articulo
          </button>
        )}

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
    </div>
  );
};