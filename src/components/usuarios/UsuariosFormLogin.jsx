// src/components/UsuariosFormLogin.jsx
//
// LOGIN (JWT Bearer, sem refresh)
// - Envia email/senha para POST /usuarios/login
// - Back retorna { usuario, token }
// - Salvamos token em sessionStorage("at") e user em sessionStorage("user")
// - Redireciona para /livros (área autenticada)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../shared/Toast";
import { useAuth } from "../../auth/useAuth";


const UsuariosFormLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, senha); // usa o AuthContext (chama /usuarios/login)
      setSenha("");
      navigate("/livros");
    } catch (err) {
      setError(err?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <Toast error={error} setError={setError} />}

      <form onSubmit={handleSubmit} className="m-2">
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
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default UsuariosFormLogin;
