import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SessionProvider } from '@/context/SessionProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { RequireAuth } from '@/components/autenticacion/RequireAuth';
import { RequireRoles } from '@/components/autenticacion/RequireRoles';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UsersPage } from '@/pages/UsersPage';
import { TicketsPage } from '@/pages/TicketsPage';
import { EditProfilePage } from '@/pages/EditProfilePage';
import { EquipmentsPage } from '@/pages/EquipmentsPage';
import { AvailabilityPage } from '@/pages/AvailabilityPage';
import { EvaluationsPage } from '@/pages/EvaluationsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { KnowledgeBasePage } from '@/pages/KnowledgeBasePage';
import { SlaPage } from '@/pages/SlaPage';
import type { RolUsuario } from '@/types/roles';

const TODOS: RolUsuario[] = ['Jefe TI', 'Técnico', 'Usuario'];
const OPERATIVOS: RolUsuario[] = ['Jefe TI', 'Técnico'];
const JEFES: RolUsuario[] = ['Jefe TI'];
const CALIFICAN: RolUsuario[] = ['Jefe TI', 'Usuario'];

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
            path: 'perfil',
            handle: { title: 'Mi perfil' },
            element: <EditProfilePage />,
          },
          {
            element: <RequireRoles allow={TODOS} />,
            children: [
              {
                index: true,
                handle: { title: 'Dashboard' },
                element: <DashboardPage />,
              },
              {
                path: 'tickets',
                handle: { title: 'Tickets' },
                element: <TicketsPage />,
              },
              {
                path: 'base-conocimiento',
                handle: { title: 'Base de conocimiento' },
                element: <KnowledgeBasePage />,
              },
            ],
          },
          {
            element: <RequireRoles allow={JEFES} />,
            children: [
              {
                path: 'usuarios',
                handle: { title: 'Gestión de usuarios' },
                element: <UsersPage />,
              },
              {
                path: 'equipos',
                handle: { title: 'Equipos' },
                element: <EquipmentsPage />,
              },
              {
                path: 'prioridades-sla',
                handle: { title: 'Prioridades SLA' },
                element: <SlaPage />,
              },
              {
                path: 'reportes',
                handle: { title: 'Reportes' },
                element: <ReportsPage />,
              },
            ],
          },
          {
            path: 'disponibilidad',
            handle: { title: 'Disponibilidad de técnicos' },
            element: <RequireRoles allow={OPERATIVOS} />,
            children: [{ index: true, element: <AvailabilityPage /> }],
          },
          {
            path: 'evaluaciones',
            handle: { title: 'Evaluaciones de servicio' },
            element: <RequireRoles allow={CALIFICAN} />,
            children: [{ index: true, element: <EvaluationsPage /> }],
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