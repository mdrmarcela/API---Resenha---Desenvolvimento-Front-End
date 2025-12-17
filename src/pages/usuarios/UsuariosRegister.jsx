import { Link, Navigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import UsuariosFormRegister from "../../components/UsuariosFormRegister"; // ajuste o caminho conforme sua pasta
import { useAuth } from "../../auth/useAuth";

const UsuariosRegister = () => {
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

  // logado => área autenticada
  if (user) {
    return <Navigate to="/livros" replace />;
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-3" style={{ maxWidth: 720 }}>
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" className="btn btn-outline-secondary">
            Voltar
          </Link>

          <Link to="/usuarios/login" className="btn btn-primary">
            Já tenho conta
          </Link>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <h3 className="mb-3">Criar conta</h3>
            <UsuariosFormRegister />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosRegister;
