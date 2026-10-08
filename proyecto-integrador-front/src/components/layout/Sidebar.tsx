import { Headset, Users, UserRound, X, LogOut, Ticket, Server, Clock, UserRoundCheck, Star, BarChart3, BookOpen, LayoutDashboard } from "lucide-react";
import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ESTILOS_AVATAR } from '@/utils/avatarStyles';
import { ESTILOS_ROL } from '@/utils/roleStyles';
import { useSession } from '@/context/session';
import type { RolUsuario } from '@/types/roles';

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

interface NavSection {
  title: string;
  items: NavItem[];
}

const CUENTA_SECTION: NavSection = {
  title: "Cuenta",
  items: [{ to: "/perfil", label: "Mi perfil", icon: <UserRound /> }],
};

const PRINCIPAL_SECTION: NavSection = {
  title: "Principal",
  items: [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard /> },
    { to: "/tickets", label: "Tickets", icon: <Ticket /> },
  ],
};

const MENU_BY_ROLE: Record<RolUsuario, NavSection[]> = {
  "Jefe TI": [
    PRINCIPAL_SECTION,
    {
      title: "Gestion",
      items: [
        { to: "/usuarios", label: "Usuarios", icon: <Users /> },
        { to: "/equipos", label: "Equipos", icon: <Server /> },
        { to: "/prioridades-sla", label: "Prioridades SLA", icon: <Clock /> },
        { to: "/disponibilidad", label: "Disponibilidad", icon: <UserRoundCheck /> },
      ],
    },
    {
      title: "Calidad",
      items: [
        { to: "/evaluaciones", label: "Evaluaciones", icon: <Star /> },
        { to: "/reportes", label: "Reportes", icon: <BarChart3 /> },
        { to: "/base-conocimiento", label: "Base de conocimiento", icon: <BookOpen /> },
      ],
    },
    CUENTA_SECTION,
  ],
  "Técnico": [
    PRINCIPAL_SECTION,
    {
      title: "Gestion",
      items: [
        { to: "/disponibilidad", label: "Disponibilidad", icon: <UserRoundCheck /> },
      ],
    },
    {
      title: "Calidad",
      items: [
        { to: "/base-conocimiento", label: "Base de conocimiento", icon: <BookOpen /> },
      ],
    },
    CUENTA_SECTION,
  ],
  "Usuario": [
    PRINCIPAL_SECTION,
    {
      title: "Calidad",
      items: [
        { to: "/evaluaciones", label: "Evaluaciones", icon: <Star /> },
        { to: "/base-conocimiento", label: "Base de conocimiento", icon: <BookOpen /> },
      ],
    },
    CUENTA_SECTION,
  ],
};

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useSession();

  if (!user) return null;

  const visibleSections = MENU_BY_ROLE[user.rol];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-sm transition-transform duration-300 ease-in-out lg:static lg:h-auto lg:shrink-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
                className={`w-max rounded-md p-0.5 px-1.5 text-sm font-semibold ${ESTILOS_ROL[user.rol]}`}
              >
                {user.rol}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className=" cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden "
            aria-label="Cerrar menú"
          >
            <X />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
          {visibleSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>

              <div className="space-y-1.5">
                {section.items.map((item) => (
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
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 group-hover:bg-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-lg p-1.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${ESTILOS_AVATAR[user.colorAvatar]}`}
            >
              {user.avatarIniciales}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-bold text-slate-800">
                {user.nombre}
              </span>
              <span className="truncate text-[11px] text-slate-400">
                {user.correo}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-600" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
