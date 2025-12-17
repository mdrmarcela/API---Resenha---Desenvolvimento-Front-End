import Navbar from "../components/shared/Navbar";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const Perfil = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) return <p>Carregando usuário...</p>;
  if (!user) return <Navigate to="/usuarios/login" replace />;

  return (
    <div>
      <Navbar />
      <div className="container mt-3" style={{ maxWidth: 720 }}>
        <h2>Meu perfil</h2>
        <div className="card mt-3">
          <div className="card-body">
            <div><strong>ID:</strong> {user.id}</div>
            <div><strong>Nome:</strong> {user.nome}</div>
            <div><strong>Email:</strong> {user.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
