import { SquarePen } from 'lucide-react';
import type { User } from '../types/user.types';
import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';

interface UsersTableProps {
  users: User[];
  onEditUser?: (user: User) => void;
}

export const UsersTable = ({ users, onEditUser }: UsersTableProps) => {
  const getAvatarStyles = (color: User['avatarColor']) => {
    switch (color) {
      case 'blue':
        return 'bg-[#d9edf7] text-[#1976d2]';
      case 'green':
        return 'bg-[#dcfce7] text-[#2e7d32]';
      case 'amber':
      default:
        return 'bg-[#fef3c7] text-[#b45309]';
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                NOMBRE
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                CORREO
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                ROL
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                ÁREA
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                ESTADO
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">
                {/* Espacio para acciones */}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {/* Nombre y Avatar */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarStyles(
                        user.avatarColor
                      )}`}
                    >
                      {user.avatarInitials}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {user.name}
                    </span>
                  </div>
                </td>

                {/* Correo */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm text-slate-400 underline decoration-slate-300 decoration-1 underline-offset-2 hover:text-slate-600 transition-colors cursor-pointer">
                    {user.email}
                  </span>
                </td>

                {/* Rol */}
                <td className="whitespace-nowrap px-6 py-4">
                  <UserRoleBadge role={user.role} />
                </td>

                {/* Área */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm font-normal text-slate-600">
                    {user.area}
                  </span>
                </td>

                {/* Estado */}
                <td className="whitespace-nowrap px-6 py-4">
                  <UserStatusBadge status={user.status} />
                </td>

                {/* Acción: Editar */}
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onEditUser?.(user)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                    aria-label={`Editar usuario ${user.name}`}
                  >
                    <SquarePen className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
