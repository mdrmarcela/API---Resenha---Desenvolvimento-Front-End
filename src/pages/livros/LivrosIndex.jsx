import { Link, Navigate, useLocation } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import { useAuth } from "../../auth/useAuth";
import LivrosList from "../../components/livros/LivrosList";

const LivrosIndex = () => {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-3">
          <div className="alert alert-info">Carregando usuário...</div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/usuarios/login" replace />;

  const okMsg = location.state?.ok;

  return (
    <div>
      <Navbar />

      <div className="container mt-3">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Link to="/" className="btn btn-outline-secondary">
            Voltar
          </Link>

          <Link to="/livros/create" className="btn btn-success">
            + Criar Livro
          </Link>
        </div>

        <div className="mt-3">
          <h2 className="mb-1">Minha Biblioteca</h2>
          <div className="text-muted">Gerencie seus livros e resenhas.</div>
        </div>

        {okMsg && <div className="alert alert-success mt-3 mb-0">{okMsg}</div>}

        <div className="mt-3">
          <LivrosList />
        </div>
      </div>
    </div>
  );
};

export default LivrosIndex;
