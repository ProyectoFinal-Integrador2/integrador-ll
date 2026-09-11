import { useState, useMemo } from 'react';
import { UsersTabs } from '../components/UsersTabs';
import { UsersTable } from '../components/UsersTable';
import { MOCK_USERS } from '../services/mockUsers';
import type { UserTabFilter, User } from '../types/user.types';

export const UsersPage = () => {
  const [activeTab, setActiveTab] = useState<UserTabFilter>('todos');
  const [users] = useState<User[]>(MOCK_USERS);

  const filteredUsers = useMemo(() => {
    if (activeTab === 'tecnicos') {
      return users.filter((u) => u.role === 'Técnico');
    }
    if (activeTab === 'usuarios') {
      return users.filter((u) => u.role === 'Usuario');
    }
    return users;
  }, [activeTab, users]);

  return (
    <div className="w-full">
      {/* Pestañas de filtrado superior */}
      <UsersTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tabla con tarjeta blanca y borde redondeado */}
      <UsersTable users={filteredUsers} />
    </div>
  );
};
