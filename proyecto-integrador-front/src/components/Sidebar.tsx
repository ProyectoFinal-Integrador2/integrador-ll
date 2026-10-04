import { Headset, Users, UserRound, X, LogOut } from "lucide-react";
import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { CURRENT_USER } from '@/constants/currentUser';
import { ROLE_STYLES } from '@/constants/roleStyles';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  badge?: string;
}

const MENU_ITEMS: NavItem[] = [
  { to: "/usuarios", label: "Usuarios", icon: <Users /> },
  { to: "/perfil", label: "Mi perfil", icon: <UserRound /> },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/** Backdrop oscuro para móviles (bloquea la pantalla al abrir) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/** Barra lateral completa */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-sm transition-transform duration-300 ease-in-out lg:static lg:h-auto lg:shrink-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/** Cabecera logo del Sidebar */}
        <div className="flex h-16 shrink-0 items-center  justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 font-bold text-white shadow-sm">
              <Headset />
            </div>

            <div className="flex flex-col ">
              <span className="text-sm font-medium tracking-tight text-slate-800">
                Help Desk TI
              </span>
              <span
                className={`w-max rounded-md p-0.5 px-1.5 text-sm font-semibold ${ROLE_STYLES[CURRENT_USER.role]}`}
              >
                {CURRENT_USER.role}
              </span>
            </div>
          </div>
          {/** Btón cerrar (solo en móvil) */}
          <button
            type="button"
            onClick={onClose}
            className=" cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden "
            aria-label="Cerrar menú"
          >
            <X />
          </button>
        </div>

        {/** Navegación con scroll independiente si hay muchos enlaces  */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Principal
          </p>
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }
              `
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-lg opacity-80 group-hover:scale-105 transition-transform">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium group-hover:bg-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Pie del Sidebar: Usuario y Cierre de Sesión */}
        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-lg p-1.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${CURRENT_USER.avatarClassName}`}
            >
              {CURRENT_USER.avatarInitials}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-bold text-slate-800">
                {CURRENT_USER.name}
              </span>
              <span className="truncate text-[11px] text-slate-400">
                {CURRENT_USER.email}
              </span>
            </div>
          </div>

          {/* Botón Cerrar Sesión: inactivo hasta que exista autenticación */}
          <button
            type="button"
            disabled
            title="Disponible cuando HU-01 (autenticación) esté implementada"
            className="mt-3 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-medium text-slate-400 shadow-2xs transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
