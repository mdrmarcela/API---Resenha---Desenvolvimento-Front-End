import { useEffect, useState } from "react";
import Navbar from "../../components/shared/Navbar";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { useAuthFetch } from "../../auth/useAuthFetch";

const UsuariosIndex = () => {
  const { user, authLoading } = useAuth();
  const authFetch = useAuthFetch();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setErro("");
    setLoading(true);

    try {
      const res = await authFetch("/usuarios");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.erro || "Erro ao listar usuários");
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function deletar(id) {
    if (!confirm("Excluir usuário?")) return;

    setErro("");
    const res = await authFetch(`/usuarios/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErro(data?.erro || "Erro ao excluir usuário");
      return;
    }
    await carregar();
  }

  if (authLoading) return <p>Carregando usuário...</p>;
  if (!user) return <Navigate to="/usuarios/login" replace />;

  return (
  <div>
    <Navbar />
    <div className="container mt-3">
      <div className="d-flex gap-2">
        <Link to="/" className="btn btn-outline-secondary">
          Voltar
        </Link>
        <Link to="/usuarios/register" className="btn btn-primary">
          Cadastrar usuário
        </Link>
      </div>

      <h2 className="mt-3">Usuários</h2>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {loading ? (
        <div className="alert alert-info">Carregando...</div>
      ) : (
        <div className="list-group">
          {usuarios.map((u) => (
            <div
              key={u.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{u.nome}</strong>
                <div className="text-muted">{u.email}</div>
              </div>

              <div className="d-flex gap-2">
                <Link
                  className="btn btn-sm btn-outline-secondary"
                  to={`/usuarios/${u.id}/edit`}
                >
                  Editar
                </Link>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deletar(u.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
};

export default UsuariosIndex;