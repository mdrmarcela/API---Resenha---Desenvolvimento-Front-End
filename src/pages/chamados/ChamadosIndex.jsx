import { useAuth } from '../../auth/useAuth';
import Navbar from '../../components/shared/Navbar'
import ChamadosList from '../../components/chamados/ChamadosList'
import { Link, Navigate } from 'react-router-dom';

const ChamadosIndex = () => {
    const { user, authLoading } = useAuth();

    // Enquanto ainda está carregando o estado de auth, não decide redirecionar
    if (authLoading) {
        return <p>Carregando usuário...</p>; // ou um spinner bonitinho
    }

    // Se não tiver usuário logado, redireciona declarativamente
    if (!user) {
        return <Navigate to="/usuarios/login" replace />;
    }

    return (
        <div>
            <Navbar />
            <div className='d-flex flex-wrap gap-2 mx-2 mt-2'>
                <Link to="/" className="btn btn-primary">Voltar</Link>
                <Link to="/chamados/create" className='btn btn-primary'>Criar Chamado</Link>
            </div>
            <ChamadosList />
        </div>
    );
}

export default ChamadosIndex;
