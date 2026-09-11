import { useState, useMemo } from 'react';
import { UsersTabs } from '../components/UsersTabs';
import { UsersTable } from '../components/UsersTable';
import { MOCK_USERS } from '../services/mockUsers';
import type { UserTabFilter, User } from '../types/user.types';
import { EditUserModal } from '../components/modals';

export const UsersPage = () => {
  const [activeTab, setActiveTab] = useState<UserTabFilter>('todos');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    if (activeTab === 'tecnicos') {
      return users.filter((u) => u.role === 'Técnico');
    }
    if (activeTab === 'usuarios') {
      return users.filter((u) => u.role === 'Usuario');
    }
    return users;
  }, [activeTab, users]);

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
      {/* Pestañas de filtrado superior */}
      <UsersTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tabla con tarjeta blanca y borde redondeado */}
      <UsersTable users={filteredUsers}  onEditUser={handleEditUser}/>

      {/* Modal 2 de 3: Editar Usuario */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};
