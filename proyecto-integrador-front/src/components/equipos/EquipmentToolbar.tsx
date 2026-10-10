import { Plus, RefreshCw, Search } from 'lucide-react';

interface EquipmentToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenNewEquipment: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const EquipmentToolbar = ({
  searchTerm,
  onSearchChange,
  onOpenNewEquipment,
  onRefresh,
  isLoading,
}: EquipmentToolbarProps) => {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar equipos..."
            aria-label="Buscar equipos"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Actualizar equipos"
          title="Actualizar equipos"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenNewEquipment}
        className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        <Plus className="h-4 w-4" />
        <span>Nuevo equipo</span>
      </button>
    </div>
  );
};