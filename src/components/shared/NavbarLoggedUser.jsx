// LoggedUser.jsx
import { useAuthFetch } from "../../auth/useAuthFetch";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

// Pega a API_BASE_URL da variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NavbarLoggedUser = () => {
    const navigate = useNavigate();
    const authFetch = useAuthFetch();
    const { user, authLoading, setUser } = useAuth(); // agora vem do contexto

    const handleLogoutClick = async (e) => {
        e.preventDefault();
        try {
            await authFetch(`${API_BASE_URL}/api/usuarios/logout`, {
                method: 'POST',
                credentials: "include"
            });
            sessionStorage.removeItem("at");
            setUser(null);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    // Enquanto ainda está carregando o estado de auth, não decide redirecionar
    if (authLoading) {
        return null;
    }

    if (!user) {
        return (
            <ul className="nav-item dropdown m-0 p-0">
                <button
                    className="nav-link dropdown-toggle bg-transparent border-0"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Usuário Desconectado
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                        <Link className="dropdown-item text-center" type="button" to="/usuarios/login">
                            Entrar
                        </Link>
                    </li>
                    <li>
                        <Link className="dropdown-item text-center" type="button" to="/usuarios/register">
                            Registrar
                        </Link>
                    </li>
                </ul>
            </ul>
        );
    }

    return (
        <ul className="nav-item dropdown m-0 p-0">
            <button
                className="nav-link dropdown-toggle bg-transparent border-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {user.nome}
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
                <li>
                    <button className="dropdown-item text-center" type="button" onClick={handleLogoutClick}>
                        Desconectar
                    </button>
                </li>
            </ul>
        </ul>
    );
};

export default NavbarLoggedUser;
