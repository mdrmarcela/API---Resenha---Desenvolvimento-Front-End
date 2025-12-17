import { Link } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import { useAuth } from "../auth/useAuth";

const App = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-4">
          <div className="alert alert-info">Carregando usuário...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="container mt-3">
        <div className="p-4 border rounded">
          <h1 className="mb-2">Sistema de Resenhas</h1>
          <p className="text-muted mb-0">
            Front-end SPA consumindo a API de Livros e Resenhas (JWT).
          </p>

          <div className="d-flex flex-wrap gap-2 mt-3">
            {!user ? (
              <>
                <Link to="/usuarios/login" className="btn btn-primary">
                  Entrar
                </Link>
                <Link to="/usuarios/register" className="btn btn-outline-primary">
                  Criar conta
                </Link>
                <Link to="/sobre" className="btn btn-outline-secondary">
                  Sobre
                </Link>
                <Link to="/contato" className="btn btn-outline-secondary">
                  Contato
                </Link>
              </>
            ) : (
              <>
                <div className="alert alert-success mb-0 flex-grow-1">
                  Você está logada como <strong>{user.nome}</strong>.
                </div>

                <Link to="/livros" className="btn btn-success">
                  Ir para Livros
                </Link>
                <Link to="/livros/create" className="btn btn-outline-success">
                  Cadastrar Livro
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
