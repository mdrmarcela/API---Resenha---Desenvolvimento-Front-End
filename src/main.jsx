import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

import Layout from "./pages/Layout.jsx";
import App from "./pages/App.jsx";
import Sobre from "./pages/Sobre.jsx";
import Contato from "./pages/Contato.jsx";

import UsuariosLogin from "./pages/usuarios/UsuariosLogin.jsx";
import UsuariosRegister from "./pages/usuarios/UsuariosRegister.jsx";
import UsuariosIndex from "./pages/usuarios/UsuariosIndex.jsx";
import Perfil from "./pages/usuarios/Perfil.jsx";

import LivrosIndex from "./pages/livros/LivrosIndex.jsx";
import LivrosCreate from "./pages/livros/LivrosCreate.jsx";
import LivrosShow from "./pages/livros/LivrosShow.jsx";
import LivrosEdit from "./pages/livros/LivrosEdit.jsx";

import ResenhasEdit from "./pages/resenhas/ResenhasEdit.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "sobre", element: <Sobre /> },
      { path: "contato", element: <Contato /> },

      // Auth
      { path: "usuarios/login", element: <UsuariosLogin /> },
      { path: "usuarios/register", element: <UsuariosRegister /> },

      // Aliases curtos (opcional, mas prático)
      { path: "login", element: <Navigate to="/usuarios/login" replace /> },
      { path: "cadastro", element: <Navigate to="/usuarios/register" replace /> },

      // Área autenticada
      {
        path: "livros",
        element: (
          <PrivateRoute>
            <LivrosIndex />
          </PrivateRoute>
        ),
      },
      {
        path: "livros/create",
        element: (
          <PrivateRoute>
            <LivrosCreate />
          </PrivateRoute>
        ),
      },
      {
        path: "livros/:id",
        element: (
          <PrivateRoute>
            <LivrosShow />
          </PrivateRoute>
        ),
      },
      {
        path: "livros/:id/edit",
        element: (
          <PrivateRoute>
            <LivrosEdit />
          </PrivateRoute>
        ),
      },

      // Resenhas (aninhadas)
      {
        path: "livros/:livro_id/resenhas/:id/edit",
        element: (
          <PrivateRoute>
            <ResenhasEdit />
          </PrivateRoute>
        ),
      },

      // Usuários (listar + deletar)
      {
        path: "usuarios",
        element: (
          <PrivateRoute>
            <UsuariosIndex />
          </PrivateRoute>
        ),
      },
      {
        path: "perfil",
        element: (
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        ),
      },

      // fallback
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
