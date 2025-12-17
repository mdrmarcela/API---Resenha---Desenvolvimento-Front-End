// src/pages/usuarios/UsuariosLogin.jsx
import { Link } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import UsuariosFormLogin from "../../components/usuarios/UsuarioFormLogin";
import { Navigate } from 'react-router-dom';
import { useAuth } from "../../auth/useAuth";

const UsuariosLogin = () => {
    const { user, authLoading } = useAuth();

    // Enquanto ainda está carregando o estado de auth, não decide redirecionar
    if (authLoading) {
        return <p>Carregando usuário...</p>; // ou um spinner bonitinho
    }

    // Se tiver usuário logado, redireciona declarativamente
    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Navbar />
            <Link to="/" className="btn btn-primary mx-2 mt-2">Voltar</Link>
            <UsuariosFormLogin />
        </div>
    );
};

export default UsuariosLogin;
