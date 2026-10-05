import { Plus, Search } from 'lucide-react';

interface UsersToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenNewUser: () => void;
}

export const UsersToolbar = ({
  searchTerm,
  onSearchChange,
  onOpenNewUser,
}: UsersToolbarProps) => {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      {/** Buscador: filtra por nombre, correo y rol. Solo usuarios, este
          modulo todavia no maneja tickets. */}
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar usuarios..."
          aria-label="Buscar usuarios"
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
        />
      </div>

      <button
        type="button"
        onClick={onOpenNewUser}
        className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        <Plus className="h-4 w-4" />
        <span>Nuevo usuario</span>
      </button>
    </div>
  );
};
