import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, Header } from "../components";
import { RegisterUserModal } from "../features/users";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eaecf0]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar} 
      />

      {/** Contenedor derecho (Header + Contenido) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/** Header con buscador, botón + Nuevo y notificaciones */}
        <Header 
          onOpenSidebar={handleOpenSidebar} 
          title="Gestión de usuarios" 
          onOpenNewUser={() => setIsNewUserModalOpen(true)}
        />

        {/* Zona dinámica del main con scroll independiente */}
        <main className="flex-1 overflow-y-auto bg-[#eaecf0] p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Modal 1 de 3: Registrar nuevo usuario */}
      <RegisterUserModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
