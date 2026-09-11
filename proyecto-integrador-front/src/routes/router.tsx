import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import EditarPerfil from "../pages/EditarPerfil";
import { UsersPage } from "../features/users";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <UsersPage />,
      },
      {
        path: "usuarios",
        element: <UsersPage />,
      },
      {
        path: "perfil",
        element: <EditarPerfil rolUsuario="Jefe TI" />,
      },
    ],
  },
  {
    path: "*",
    element: <h1>404 - Página no encontrada</h1>,
  },
]);
