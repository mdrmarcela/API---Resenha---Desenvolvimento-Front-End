import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import App from "./pages/App.jsx";

import UsuariosLogin from "./pages/usuarios/UsuariosLogin.jsx";
import UsuariosRegister from "./pages/usuarios/UsuariosRegister.jsx";

import LivrosIndex from "./pages/livros/LivrosIndex.jsx";
import LivrosCreate from "./pages/livros/LivrosCreate.jsx";
import LivrosShow from "./pages/livros/LivrosShow.jsx";
import LivrosEdit from "./pages/livros/LivrosEdit.jsx";

import ResenhasEdit from "./pages/resenhas/ResenhasEdit.jsx";

import Perfil from "./pages/Perfil.jsx";
import UsuariosIndex from "./pages/usuarios/UsuariosIndex.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const router = createHashRouter([
  { path: "/", element: <App /> },

  { path: "/usuarios/login", element: <UsuariosLogin /> },
  { path: "/usuarios/register", element: <UsuariosRegister /> },

  { path: "/livros", element: <LivrosIndex /> },
  { path: "/livros/create", element: <LivrosCreate /> },
  { path: "/livros/:id", element: <LivrosShow /> },
  { path: "/livros/:id/edit", element: <LivrosEdit /> },

  { path: "/livros/:livro_id/resenhas/:id/edit", element: <ResenhasEdit /> },

  { path: "/perfil", element: <Perfil /> },
  { path: "/usuarios", element: <UsuariosIndex /> },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
