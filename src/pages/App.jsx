import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const App = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) return <p>Carregando...</p>;

  if (user) return <Navigate to="/livros" replace />;

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: 420, maxWidth: "90vw" }}>
        <div className="card-body text-center p-4">
          <h2 className="mb-2">Minha Biblioteca</h2>
          <p className="text-muted mb-4">Entre ou cadastre-se para acessar seus livros e resenhas.</p>

          <Link to="/usuarios/login" className="btn btn-primary w-100">
            Entrar
          </Link>

          <div className="mt-3">
            <span className="text-muted">Ainda não tem conta? </span>
            <Link to="/usuarios/register">Cadastre-se</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;