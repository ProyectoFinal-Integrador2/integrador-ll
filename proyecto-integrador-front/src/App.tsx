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
import type { UserRole } from '@/types/roles';

/**
 * Los roles de cada pantalla. El dashboard y los tickets cambian de contenido
 * segun quien entre, asi que los ven los tres; la gestion heavy es solo del
 * Jefe; y las evaluaciones las pueden ver el Jefe y el solicitante, cada uno con
 * su propia lectura.
 */
const TODOS: UserRole[] = ['Jefe TI', 'Técnico', 'Usuario'];
const OPERATIVOS: UserRole[] = ['Jefe TI', 'Técnico'];
const JEFES: UserRole[] = ['Jefe TI'];
const CALIFICAN: UserRole[] = ['Jefe TI', 'Usuario'];

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
            // Dashboard, tickets y base de conocimiento: los tres roles.
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
            // Gestion interna: usuarios, equipos, SLA y reportes.
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
            // La disponibilidad es de los tecnicos, asi que el solicitante no.
            path: 'disponibilidad',
            handle: { title: 'Disponibilidad de técnicos' },
            element: <RequireRoles allow={OPERATIVOS} />,
            children: [{ index: true, element: <AvailabilityPage /> }],
          },
          {
            /**
             * Propia ruta porque la lectura depende del rol: el Jefe TI ve el
             * listado completo y el solicitante sus pendientes y su historial.
             * `EvaluationsPage` decide cual de los dos montar.
             */
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