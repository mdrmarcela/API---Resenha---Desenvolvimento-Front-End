import { useEffect, useState } from "react";
import Navbar from "../../components/shared/Navbar";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { useAuthFetch } from "../../auth/useAuthFetch";
import UsuarioEditForm from "../../components/usuarios/UsuariosEditForm";

const UsuariosEdit = () => {
  const { id } = useParams();
  const { user, authLoading } = useAuth();
  const authFetch = useAuthFetch();

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      setErro("");
      setLoading(true);

      const res = await authFetch("/usuarios", { signal: ac.signal });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.erro || "Erro ao carregar usuários");

      const encontrado = Array.isArray(data)
        ? data.find((u) => Number(u.id) === Number(id))
        : null;

      if (!encontrado) throw new Error("Usuário não encontrado");
      setUsuario(encontrado);
      setLoading(false);
    })().catch((e) => {
      if (e?.name !== "AbortError") setErro(e.message);
      setLoading(false);
    });

    return () => ac.abort();
  }, [id]);

  if (authLoading) return <p>Carregando usuário...</p>;
  if (!user) return <Navigate to="/usuarios/login" replace />;

  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <Link to="/usuarios" className="btn btn-outline-secondary">
          Voltar
        </Link>

        <h2 className="mt-3">Editar Usuário</h2>

        {erro && <div className="alert alert-danger mt-2">{erro}</div>}
        {loading && <div className="alert alert-info mt-2">Carregando...</div>}

        {!loading && usuario && <UsuarioEditForm usuario={usuario} />}
      </div>
    </div>
  );
};

export default UsuariosEdit;