import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layouts';
import { EditarPerfil, UsersPage } from '@/features/users';
import { CURRENT_USER } from '@/constants/currentUser';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        handle: { title: 'Gestión de usuarios' },
        element: <UsersPage />,
      },
      {
        path: 'usuarios',
        handle: { title: 'Gestión de usuarios' },
        element: <UsersPage />,
      },
      {
        path: 'perfil',
        handle: { title: 'Mi perfil' },
        element: <EditarPerfil rolUsuario={CURRENT_USER.role} />,
      },
    ],
  },
  {
    path: '*',
    element: <h1>404 - Página no encontrada</h1>,
  },
]);
