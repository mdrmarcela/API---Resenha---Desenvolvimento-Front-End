import { Link, Navigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import UsuariosFormLogin from "../../components/usuarios/UsuariosFormLogin"; 
import { useAuth } from "../../auth/useAuth";

const UsuariosLogin = () => {
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

          <Link to="/usuarios/register" className="btn btn-primary">
            Criar conta
          </Link>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <h3 className="mb-3">Entrar</h3>
            <UsuariosFormLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosLogin;