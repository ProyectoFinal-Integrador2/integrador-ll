import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layouts';
import { UsersPage } from '@/features/users';
import { LoginPage } from '@/features/auth';
import { PerfilRoute } from '@/routes/PerfilRoute';
import { RequireAuth } from '@/routes/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <RequireAuth />,
    children: [
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
            element: <PerfilRoute />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <h1>404 - Página no encontrada</h1>,
  },
]);
