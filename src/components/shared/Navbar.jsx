import { Link, NavLink } from "react-router-dom";
import ThemeButton from "./ThemeButton";
import NavbarLoggedUser from "./NavbarLoggedUser";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                {/* 1) Brand - fica sempre à esquerda */}
                <Link className="navbar-brand" to="/">
                    Atende Aí
                </Link>

                {/* 2) Área da direita SEM participar do collapse */}
                <div className="d-flex align-items-center ms-auto order-lg-3">
                    <ThemeButton />
                    <NavbarLoggedUser />

                    {/* Botão de colapso do menu (só aparece em < lg) */}
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

                {/* 3) Menu que colapsa (apenas os links) */}
                <div
                    className="collapse navbar-collapse order-lg-2"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Chamados
                            </Link>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item" to="/chamados">
                                        Lista de Chamados
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/chamados/create">
                                        Criar Chamado
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/sobre" className="nav-link">
                                Sobre
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/contato" className="nav-link">
                                Contato
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}