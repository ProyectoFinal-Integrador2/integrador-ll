import { useEffect, useMemo, useState } from 'react';
import { UsersTabs } from '@/components/usuarios/UsersTabs';
import { UsersTable } from '@/components/usuarios/UsersTable';
import { UsersToolbar } from '@/components/usuarios/UsersToolbar';
import { EditUserModal } from '@/components/usuarios/EditUserModal';
import { RegisterUserModal } from '@/components/usuarios/RegisterUserModal';
import { createUser, fetchUsers, updateUser } from '@/services/usersApi';
import { normalizeForSearch } from '@/utils/text';
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserTabFilter,
} from '@/types/user.types';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<UserTabFilter>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  /**
   * Los setState van dentro de los callbacks de la promesa, nunca en el cuerpo
   * del efecto: llamarlos de forma sincrona ahi provoca renders en cascada
   * (`react-hooks/set-state-in-effect`).
   *
   * El URL, el parseo y el formato de error viven en usersApi, asi que aqui
   * solo queda el encadenado, que es lo unico que cambia entre carga y refresco.
   */
  useEffect(() => {
    const controller = new AbortController();

    fetchUsers(controller.signal)
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch((loadError: unknown) => {
        // Un abort es lo normal al desmontar: no es un fallo que mostrar.
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

    fetchUsers()
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch((refreshError: unknown) => setError(toMessage(refreshError)))
      .finally(() => setIsLoading(false));
  };

  const visibleUsers = useMemo(() => {
    const query = normalizeForSearch(searchTerm);

    return users.filter((user) => {
      const matchesTab =
        activeTab === 'todos'
          ? true
          : activeTab === 'tecnicos'
            ? user.role === 'Técnico'
            : user.role === 'Usuario';

      const matchesQuery =
        query.length === 0 ||
        normalizeForSearch(user.name).includes(query) ||
        normalizeForSearch(user.email).includes(query) ||
        normalizeForSearch(user.role).includes(query);

      return matchesTab && matchesQuery;
    });
  }, [activeTab, searchTerm, users]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCreate = async (input: CreateUserInput) => {
    const created = await createUser(input);
    // El back responde el usuario ya creado, asi que no hay que recargar la lista.
    setUsers((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name, 'es')));
  };

  const handleSave = async (input: UpdateUserInput) => {
    if (!selectedUser) return;

    const updated = await updateUser(selectedUser.id, input);
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

      {/* Pestañas de filtrado */}
      <UsersTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Tabla con tarjeta blanca y borde redondeado */}
      <UsersTable
        users={visibleUsers}
        onEditUser={handleEditUser}
        isLoading={isLoading}
      />

      {/* Registrar nuevo usuario */}
      <RegisterUserModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Editar usuario.
          La key cambia con el usuario y con la apertura para que el formulario
          se inicialice de cero en cada edición. */}
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