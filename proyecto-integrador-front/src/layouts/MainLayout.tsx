import { useState } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { Header, Sidebar } from '@/components';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  // react-router tipa `handle` como unknown, asi que lo acotamos aqui.
  const matches = useMatches();
  const routeTitle = (matches.at(-1)?.handle as { title?: string } | undefined)
    ?.title;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eaecf0]">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/** Contenedor derecho (Header + Contenido) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/** Header con título de la ruta y notificaciones */}
        <Header
          onOpenSidebar={handleOpenSidebar}
          title={routeTitle ?? 'Help Desk TI'}
        />

        {/* Zona dinámica del main con scroll independiente */}
        <main className="flex-1 overflow-y-auto bg-[#eaecf0] p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export { MainLayout };
