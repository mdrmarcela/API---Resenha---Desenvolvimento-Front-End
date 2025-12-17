import Navbar from "../../components/shared/Navbar";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import LivroFormCreate from "../../components/livros/LivroFormCreate";

const LivrosCreate = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) return <p>Carregando usuário...</p>;
  if (!user) return <Navigate to="/usuarios/login" replace />;

  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <Link to="/livros" className="btn btn-outline-secondary">Voltar</Link>
        <h2 className="mt-3">Criar Livro</h2>
        <LivroFormCreate />
      </div>
    </div>
  );
};

export default LivrosCreate;
