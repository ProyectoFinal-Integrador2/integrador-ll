import { useState, useMemo } from 'react';
import { UsersTabs } from '@/components/UsersTabs';
import { UsersTable } from '@/components/UsersTable';
import { UsersToolbar } from '@/components/UsersToolbar';
import { EditUserModal } from '@/components/EditUserModal';
import { RegisterUserModal } from '@/components/RegisterUserModal';
import { MOCK_USERS } from '@/services/mockUsers';
import { normalizeForSearch } from '@/utils/text';
import type { UserTabFilter, User } from '@/types/user.types';

export const UsersPage = () => {
  const [activeTab, setActiveTab] = useState<UserTabFilter>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

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

  const handleSaveUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  return (
    <div className="w-full">
      <UsersToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenNewUser={() => setIsNewUserModalOpen(true)}
      />

      {/* Pestañas de filtrado */}
      <UsersTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tabla con tarjeta blanca y borde redondeado */}
      <UsersTable users={visibleUsers} onEditUser={handleEditUser} />

      {/* Registrar nuevo usuario */}
      <RegisterUserModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
      />

      {/* Editar usuario.
          La key cambia con el usuario y con la apertura para que el formulario
          se inicialice de cero en cada edición. */}
      <EditUserModal
        key={`${selectedUser?.id ?? 'sin-seleccion'}-${isEditModalOpen}`}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};
