import { SquarePen } from 'lucide-react';
import { ESTILOS_AVATAR } from '@/utils/avatarStyles';
import type { Usuario } from '@/types/user.types';
import { UserRoleBadge } from '@/components/usuarios/UserRoleBadge';
import { UserStatusBadge } from '@/components/usuarios/UserStatusBadge';

interface UsersTableProps {
  users: Usuario[];
  onEditUser?: (user: Usuario) => void;
  isLoading?: boolean;
}

export const UsersTable = ({ users, onEditUser, isLoading }: UsersTableProps) => {
  if (isLoading) {
    return (
      <div className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-xs">
        <p className="text-sm text-slate-400">Cargando usuarios...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-xs">
        <p className="text-sm text-slate-400">No hay usuarios para mostrar.</p>
      </div>
    );
  }

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
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${ESTILOS_AVATAR[
                        user.colorAvatar
                      ]}`}
                    >
                      {user.avatarIniciales}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {user.nombre}
                    </span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm text-slate-400 underline decoration-slate-300 decoration-1 underline-offset-2 hover:text-slate-600 transition-colors cursor-pointer">
                    {user.correo}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <UserRoleBadge role={user.rol} />
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm font-normal text-slate-600">
                    {user.area}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <UserStatusBadge status={user.estado} />
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onEditUser?.(user)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                    aria-label={`Editar usuario ${user.nombre}`}
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
