import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SessionProvider } from '@/context/SessionProvider';
import { MainLayout } from '@/components/MainLayout';
import { RequireAuth } from '@/components/RequireAuth';
import { LoginPage } from '@/pages/LoginPage';
import { UsersPage } from '@/pages/UsersPage';
import { TicketsPage } from '@/pages/TicketsPage';
import { EditProfilePage } from '@/pages/EditProfilePage';

const router = createBrowserRouter([
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
            path: 'tickets',
            handle: { title: 'Tickets' },
            element: <TicketsPage />,
          },
          {
            path: 'perfil',
            handle: { title: 'Mi perfil' },
            element: <EditProfilePage />,
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

function App() {
  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  );
}

export { App };