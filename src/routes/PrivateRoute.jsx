import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Carregando...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/usuarios/login" replace />;
  return children;
}
