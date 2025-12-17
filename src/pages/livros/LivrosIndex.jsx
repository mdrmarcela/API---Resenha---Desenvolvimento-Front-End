import { Link, Navigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import { useAuth } from "../../auth/useAuth";
import LivrosList from "../../components/livros/LivrosList";

const LivrosIndex = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) return <p>Carregando usuário...</p>;
  if (!user) return <Navigate to="/usuarios/login" replace />;

  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <div className="d-flex flex-wrap gap-2">
          <Link to="/" className="btn btn-outline-secondary">Voltar</Link>
          <Link to="/livros/create" className="btn btn-success">Criar Livro</Link>
        </div>

        <h2 className="mt-3">Livros</h2>
        <LivrosList />
      </div>
    </div>
  );
};

export default LivrosIndex;
