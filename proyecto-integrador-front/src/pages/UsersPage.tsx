import { useEffect, useMemo, useState } from 'react';
import { UsersTabs } from '@/components/usuarios/UsersTabs';
import { UsersTable } from '@/components/usuarios/UsersTable';
import { UsersToolbar } from '@/components/usuarios/UsersToolbar';
import { EditUserModal } from '@/components/usuarios/EditUserModal';
import { RegisterUserModal } from '@/components/usuarios/RegisterUserModal';
import { crearUsuario, obtenerUsuarios, actualizarUsuario } from '@/services/usersApi';
import { normalizarParaBusqueda } from '@/utils/text';
import type { CrearUsuarioInput, ActualizarUsuarioInput, Usuario, FiltroUsuario } from '@/types/user.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const UsersPage = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<FiltroUsuario>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    obtenerUsuarios(controller.signal)
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch((loadError: unknown) => {
        if (isAbortError(loadError)) return;
        setError(toMessage(loadError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);

    obtenerUsuarios()
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  const visibleUsers = useMemo(() => {
    const query = normalizarParaBusqueda(searchTerm);

    return users.filter((user) => {
      const matchesTab =
        activeTab === 'todos'
          ? true
          : activeTab === 'tecnicos'
            ? user.rol === 'Técnico'
            : user.rol === 'Usuario';

      const matchesQuery =
        query.length === 0 ||
        normalizarParaBusqueda(user.nombre).includes(query) ||
        normalizarParaBusqueda(user.correo).includes(query) ||
        normalizarParaBusqueda(user.rol).includes(query);

      return matchesTab && matchesQuery;
    });
  }, [activeTab, searchTerm, users]);

  const handleEditUser = (user: Usuario) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCreate = async (input: CrearUsuarioInput) => {
    const creado = await crearUsuario(input);
    setUsers((prev) =>
      [...prev, creado.usuario].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')),
    );
    return creado;
  };

  const handleSave = async (input: ActualizarUsuarioInput) => {
    if (!selectedUser) return;

    const updated = await actualizarUsuario(selectedUser.id, input);
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
  };

  return (
    <div className="w-full">
      <UsersToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenNewUser={() => setIsNewUserModalOpen(true)}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <UsersTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <UsersTable
        users={visibleUsers}
        onEditUser={handleEditUser}
        isLoading={isLoading}
      />

      <RegisterUserModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        onSubmit={handleCreate}
      />

      <EditUserModal
        key={`${selectedUser?.id ?? 'sin-seleccion'}-${isEditModalOpen}`}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSubmit={handleSave}
      />
    </div>
  );
};