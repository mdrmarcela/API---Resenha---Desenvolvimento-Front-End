import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../../auth/useAuthFetch";
import Toast from "../shared/Toast";
import { useAuth } from "../../auth/useAuth";

const UsuarioEditForm = ({ usuario }) => {
  const { id } = useParams();
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const { user: currentUser, setUser } = useAuth();

  const [nome, setNome] = useState(usuario?.nome || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [senha, setSenha] = useState(""); // opcional (só envia se preencher)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body = {
        nome: nome.trim(),
        email: email.trim(),
      };

      // só manda senha se usuário digitou (evita trocar pra vazio)
      const s = senha.trim();
      if (s) body.senha = s;

      const res = await authFetch(`/usuarios/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.erro || "Erro ao atualizar usuário");

      // se o usuário editado for o mesmo que está logado, atualiza o contexto
      if (currentUser?.id && Number(currentUser.id) === Number(id)) {
        // se o back retornar o usuário atualizado, usa; se não, usa o body
        const atualizado = data?.usuario || data || { ...currentUser, ...body };
        setUser(atualizado);
      }

      navigate("/usuarios");
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="m-2" style={{ maxWidth: 720 }}>
      {error && <Toast error={error} setError={setError} />}

      <div className="my-2">
        <label className="form-label" htmlFor="id-nome">Nome</label>
        <input
          id="id-nome"
          className="form-control"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div className="my-2">
        <label className="form-label" htmlFor="id-email">E-mail</label>
        <input
          id="id-email"
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="my-2">
        <label className="form-label" htmlFor="id-senha">
          Nova senha (opcional)
        </label>
        <input
          id="id-senha"
          type="password"
          className="form-control"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Preencha apenas se quiser trocar"
        />
      </div>

      <button className="btn btn-primary mt-2" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
};

export default UsuarioEditForm;
