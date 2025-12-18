import { useEffect, useState } from "react";
import Navbar from "../../components/shared/Navbar";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { useAuthFetch } from "../../auth/useAuthFetch";
import ResenhaEditForm from "../../components/resenhas/ResenhaEditForm";

const ResenhasEdit = () => {
  const { livro_id, id } = useParams();
  const { user, authLoading } = useAuth();
  const authFetch = useAuthFetch();

  const [resenha, setResenha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    (async () => {
      setErro("");
      setLoading(true);

      const res = await authFetch(`/livros/${livro_id}/resenhas/${id}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.erro || "Erro ao carregar resenha");

      setResenha(data);
      setLoading(false);
    })().catch((e) => {
      setErro(e.message);
      setLoading(false);
    });
  }, [livro_id, id]);

  if (authLoading) return <p>Carregando usuário...</p>;
  if (!user) return <Navigate to="/usuarios/login" replace />;

  return (
    <div>
      <Navbar />

      <div className="container mt-3">
        <Link to={`/livros/${livro_id}`} className="btn btn-outline-secondary">
          Voltar
        </Link>

        <h2 className="mt-3">Editar Resenha</h2>

        {erro && <div className="alert alert-danger mt-2">{erro}</div>}
        {loading && <div className="alert alert-info mt-2">Carregando...</div>}

        {!loading && resenha && <ResenhaEditForm resenha={resenha} />}
      </div>
    </div>
  );
};

export default ResenhasEdit;