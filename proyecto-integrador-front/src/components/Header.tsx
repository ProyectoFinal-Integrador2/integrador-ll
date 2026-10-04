import { Menu, Search, Plus, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenSidebar?: () => void;
  onOpenNewUser?: () => void;
  title?: string;
}

export const Header = ({
  onOpenSidebar,
  onOpenNewUser,
  title = 'Gestión de usuarios',
}: HeaderProps) => {
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Lado izquierdo: Botón móvil + Título */}
      <div className="flex items-center gap-3">
        {onOpenSidebar && (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="cursor-pointer rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800">
          {title}
        </h1>
      </div>

      {/* Lado derecho: Buscador + Botón + Nuevo + Campana de notificaciones */}
      <div className="flex items-center gap-3">
        {/* Buscador */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar tickets, usuarios..."
            className="w-56 md:w-64 rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-3 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Botón "+ Nuevo" */}
        <button
          type="button"
          onClick={onOpenNewUser}
          className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo</span>
        </button>

        {/* Botón Notificaciones */}
        <button
          type="button"
          className="relative flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};
