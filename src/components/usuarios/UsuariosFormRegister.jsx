import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../shared/Toast";
import { useAuth } from "../../auth/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const UsuariosFormRegister = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const auth = useAuth?.() || {};
  const registerFn = auth.register;
  const loginFn = auth.login;
  const setUser = auth.setUser;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (typeof registerFn === "function") {
        await registerFn({ nome, email, senha });
        navigate("/livros");
        return;
      }

      const resRegister = await fetch(`${API_BASE_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dataRegister = await resRegister.json().catch(() => ({}));
      if (!resRegister.ok) {
        throw new Error(dataRegister?.erro || "Falha no cadastro");
      }

      if (typeof loginFn === "function") {
        await loginFn(email, senha);
      } else {
        const resLogin = await fetch(`${API_BASE_URL}/usuarios/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });

        const dataLogin = await resLogin.json().catch(() => ({}));
        if (!resLogin.ok) {
          throw new Error(dataLogin?.erro || "Falha ao autenticar após cadastro");
        }

        sessionStorage.setItem("at", dataLogin.token);
        sessionStorage.setItem("user", JSON.stringify(dataLogin.usuario));

        if (typeof setUser === "function") setUser(dataLogin.usuario);
      }

      setSenha("");
      navigate("/livros");
    } catch (err) {
      setError(err?.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && <Toast error={error} setError={setError} />}

      <form onSubmit={handleSubmit} className="m-2">
        <div className="my-2">
          <label htmlFor="id-input-nome" className="form-label">
            Nome
          </label>
          <input
            id="id-input-nome"
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Digite seu nome"
            autoComplete="name"
          />
        </div>

        <div className="my-2">
          <label htmlFor="id-input-email" className="form-label">
            E-mail
          </label>
          <input
            id="id-input-email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Digite seu e-mail"
            autoComplete="email"
          />
        </div>

        <div className="my-2">
          <label htmlFor="id-input-senha" className="form-label">
            Senha
          </label>
          <input
            id="id-input-senha"
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            placeholder="Digite sua senha"
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Registrando…" : "Registrar"}
        </button>
      </form>
    </div>
  );
};

export default UsuariosFormRegister;