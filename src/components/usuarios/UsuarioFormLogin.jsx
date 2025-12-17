// src/components/UsuariosFormLogin.jsx
//
// OBJETIVO
// -----------------------------------------------------------------------------
// Componente de LOGIN.
// Envia email/senha (e agora o token do reCAPTCHA) para POST /api/usuarios/login.
// Se der certo, o backend retorna:
//   - access_token (curta duração) → salvamos na sessionStorage
//   - refresh token (longa duração) → vem num cookie HttpOnly (o JS não acessa)
// Depois do login, atualiza o contexto de autenticação e redireciona para "/".

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Toast from "../shared/Toast";
import { useAuth } from "../../auth/useAuth";
import ReCaptcha from "../shared/ReCaptcha";

// Pega a API_BASE_URL da variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UsuariosFormLogin = () => {
    // Estados controlados dos inputs e da UI:
    const [email, setEmail] = useState("");        // valor do campo "E-mail"
    const [senha, setSenha] = useState("");        // valor do campo "Senha"
    const [loading, setLoading] = useState(false); // indica requisição em andamento
    const [error, setError] = useState("");        // mensagem exibida no toast
    const [captchaToken, setCaptchaToken] = useState(null); // token do reCAPTCHA

    const navigate = useNavigate();                // para redirecionar após login
    const { setUser } = useAuth();                 // atualiza o usuário no contexto

    const handleSubmit = async (e) => {
        e.preventDefault(); // evita recarregar a página
        setError("");       // limpa erro anterior (se houver)

        // Se o usuário não marcou o reCAPTCHA, bloqueia o submit
        if (!captchaToken) {
            setError("Por favor, confirme o reCAPTCHA antes de entrar.");
            return;
        }

        setLoading(true);   // desabilita botão/mostra "Entrando…"

        try {
            // Chamada à API de login:
            // Agora enviamos também o token do reCAPTCHA para o backend validar.
            const res = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // recebe/enviar cookies (refresh HttpOnly)
                body: JSON.stringify({
                    email,
                    senha,
                    recaptchaToken: captchaToken,
                }),
            });

            // Tentamos ler JSON (mesmo em erro) para extrair "erro" do backend
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                // Se a API mandou { erro: "mensagem" }, usamos essa mensagem
                throw new Error(data?.erro || "Falha no login");
            }

            // Esperamos um access_token na resposta
            const at = data?.access_token;
            if (!at) throw new Error("Resposta sem access_token");

            // Guardamos APENAS o access token (curta duração) na sessionStorage
            // O refresh fica em cookie HttpOnly (não visível no JS)
            sessionStorage.setItem("at", at);

            // Atualiza o contexto de autenticação imediatamente
            try {
                const decoded = jwtDecode(at); // { sub, email, nome, exp, ... }
                setUser(decoded);
            } catch (e) {
                console.error("Falha ao decodificar access_token no login:", e);
                setUser(null);
            }

            // (Opcional) limpa o campo de senha
            setSenha("");
            // (Opcional) limpa o reCAPTCHA
            setCaptchaToken(null);

            // Redireciona para a página inicial (ou, se quiser, para "/chamados")
            navigate("/");
        } catch (error) {
            // Exibe a mensagem no toast
            setError(error.message || "Erro inesperado");
        } finally {
            // Sempre desliga o loading ao final (com sucesso ou erro)
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Toast simples de erro. Só aparece quando "error" tem conteúdo. */}
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
                    />
                </div>

                {/* reCAPTCHA do Google */}
                <div className="my-2">
                    <ReCaptcha setCaptchaToken={setCaptchaToken} loading={loading} />
                </div>

                {/* Enquanto loading=true, desabilita o botão e mostra "Entrando…" 
            Também desabilita se o reCAPTCHA não estiver marcado */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !captchaToken}
                >
                    {loading ? "Entrando…" : "Entrar"}
                </button>
            </form>
        </div>
    );
};

export default UsuariosFormLogin;
