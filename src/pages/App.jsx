import { Link } from "react-router-dom"
import Navbar from "../components/shared/Navbar"
import { useAuth } from "../auth/useAuth";


// src/App.jsx
const App = () => {
    const { user, authLoading } = useAuth();

    // Enquanto ainda está carregando o estado de auth, não decide redirecionar
    if (authLoading) {
        return <p>Carregando usuário...</p>; // ou um spinner bonitinho
    }

    return (
        <div>
            <Navbar />
            <div className="d-flex flex-wrap gap-2 mx-2 mt-2">
                {!user && <Link to="/usuarios/login" className="btn btn-primary d-inline">Entrar com Usuários</Link>}
                {!user && <Link to="/usuarios/register" className="btn btn-primary d-inline">Registrar Usuários</Link>}
                {user && <Link to="/chamados" className="btn btn-primary d-inline">Chamados</Link>}
                {user && <Link to="/chamados/create" className="btn btn-primary d-inline">Criar Chamado</Link>}
            </div>
        </div>
    )
}
export default App