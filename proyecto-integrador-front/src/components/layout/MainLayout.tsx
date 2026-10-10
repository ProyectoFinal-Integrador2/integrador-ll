import { useState } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const matches = useMatches();
  const routeTitle = (matches.at(-1)?.handle as { title?: string } | undefined)
    ?.title;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eaecf0]">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onOpenSidebar={handleOpenSidebar}
          title={routeTitle ?? 'Help Desk TI'}
        />

        <main className="flex-1 overflow-y-auto bg-[#eaecf0] p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export { MainLayout };
