import Navbar from "../components/shared/Navbar";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useAuthFetch } from "../auth/useAuthFetch";
import { useEffect, useState } from "react";

const Perfil = () => {
  const { user, authLoading, setUser } = useAuth();
  const authFetch = useAuthFetch();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState(""); // opcional

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");

  // preencher form quando carregar user
  useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (authLoading) return <p>Carregando usuário...</p>;
  if (!user) return <Navigate to="/usuarios/login" replace />;

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    setOk("");
    setLoading(true);

    try {
      const body = {
        nome: nome.trim(),
        email: email.trim(),
        // só manda senha se o usuário preencher
        ...(senha.trim() ? { senha: senha.trim() } : {}),
      };

      const res = await authFetch(`/usuarios/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.erro || "Erro ao atualizar usuário");

      // atualiza o contexto (pra Navbar e Perfil refletirem o novo nome/email)
      setUser(data);
      // opcional: limpar campo senha
      setSenha("");

      setOk("Perfil atualizado com sucesso!");
    } catch (e2) {
      setErro(e2.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-3" style={{ maxWidth: 720 }}>
        <h2>Meu perfil</h2>

        {erro && <div className="alert alert-danger mt-3">{erro}</div>}
        {ok && <div className="alert alert-success mt-3">{ok}</div>}

        <div className="card mt-3">
          <div className="card-body">
            <div><strong>ID:</strong> {user.id}</div>
            <div><strong>Nome:</strong> {user.nome}</div>
            <div><strong>Email:</strong> {user.email}</div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Editar perfil</h5>

            <form onSubmit={salvar}>
              <div className="mb-2">
                <label className="form-label">Nome</label>
                <input
                  className="form-control"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Nova senha (opcional)</label>
                <input
                  className="form-control"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Deixe em branco para não alterar"
                />
                <small className="text-muted">
                  Se preencher, precisa ter pelo menos 6 caracteres.
                </small>
              </div>

              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Salvando..." : "Salvar alterações"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Perfil;
