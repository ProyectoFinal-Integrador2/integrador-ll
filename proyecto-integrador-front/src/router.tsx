import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layouts';
import { EditarPerfil, UsersPage } from '@/features/users';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <UsersPage />,
      },
      {
        path: 'usuarios',
        element: <UsersPage />,
      },
      {
        path: 'perfil',
        element: <EditarPerfil rolUsuario="Jefe TI" />,
      },
    ],
  },
  {
    path: '*',
    element: <h1>404 - Página no encontrada</h1>,
  },
]);
