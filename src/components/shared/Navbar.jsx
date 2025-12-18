import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeButton from "./ThemeButton";
import { useAuth } from "../../auth/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function sair() {
    logout();
    navigate("/usuarios/login", { replace: true });
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Resenhas
        </Link>

        <div className="d-flex align-items-center ms-auto order-lg-3">
          <ThemeButton />

          {!user ? (
            <>
              <NavLink className="btn btn-outline-primary btn-sm ms-2" to="/usuarios/login">
                Login
              </NavLink>
              <NavLink className="btn btn-primary btn-sm ms-2" to="/usuarios/register">
                Cadastro
              </NavLink>
            </>
          ) : (
            <div className="dropdown ms-2">
              <button
                className="btn btn-outline-secondary btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user?.nome || "Conta"}
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink className="dropdown-item" to="/perfil">
                    Meu perfil
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/livros">
                    Livros
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/usuarios">
                    Usuários
                  </NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={sair}>
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          )}

          <button
            className="navbar-toggler ms-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="collapse navbar-collapse order-lg-2" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Livros
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/livros">Lista de Livros</Link></li>
                  <li><Link className="dropdown-item" to="/livros/create">Criar Livro</Link></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
