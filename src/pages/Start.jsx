import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Start() {
  const { user, authLoading } = useAuth();

  if (authLoading) return <p>Carregando...</p>;

  // logado -> livros | deslogado -> login
  return user ? <Navigate to="/livros" replace /> : <Navigate to="/usuarios/login" replace />;
}
