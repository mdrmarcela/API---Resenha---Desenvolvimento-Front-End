// src/components/UsuariosFormRegister.jsx
//
// OBJETIVO DO ARQUIVO
// -----------------------------------------------------------------------------
// Este componente exibe um formulário de REGISTRO de usuário.
// Ao enviar, ele chama POST /api/usuarios/register no backend.
// Se der certo, o backend devolve:
//   - access_token (curta duração) → guardamos na sessionStorage
//   - refresh token (longa duração) → vem em cookie HttpOnly (o JS não vê)
// Depois do registro bem-sucedido, atualizamos o contexto de autenticação
// e redirecionamos para "/".
//
// -----------------------------------------------------------------------------
// 1) useState: cria "estados" reativos (nome, email, senha, loading, error).
// 2) useNavigate: permite redirecionar para outra rota sem recarregar a página.
// 3) fetch(..., { credentials: "include" }): necessário para o navegador
//    ENVIAR/RECEBER cookies (ex.: refresh_token HttpOnly) em requisições CORS.
// 4) sessionStorage.setItem("at", ...): guardamos o access token na sessão,
//    pois ele é de curta duração e não deve persistir além da aba atual.
// 5) useAuth: atualiza o usuário logado no contexto (setUser).
// 6) jwtDecode: decodifica o access_token para preencher o contexto.
// 7) Tratamento de erro: se a resposta não for OK (4xx/5xx), exibimos um toast
//    com a mensagem vinda da API (quando existir) ou uma mensagem genérica.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Toast from "../shared/Toast";
import { useAuth } from "../../auth/useAuth";
import ReCaptcha from "../shared/ReCaptcha";

// Pega a API_BASE_URL da variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UsuariosFormRegister = () => {
    // Estados controlando os inputs e a UI:
    // - nome, email, senha: valores dos campos do formulário.
    // - loading: enquanto a requisição estiver em andamento.
    // - error: mensagem exibida no toast quando algo dá errado.
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null); // token do reCAPTCHA

    // Hook do React Router para navegar após o sucesso.
    const navigate = useNavigate();

    // Hook de autenticação para atualizar o usuário no contexto.
    const { setUser } = useAuth();

    // Handler do submit do formulário.
    async function handleSubmit(e) {
        e.preventDefault();     // impede recarregar a página
        setError("");           // limpa erro anterior (se houver)

        // Se o usuário não marcou o reCAPTCHA, bloqueia o submit
        if (!captchaToken) {
            setError("Por favor, confirme o reCAPTCHA antes de registrar.");
            return;
        }

        setLoading(true);       // ativa spinner/botão desabilitado

        try {
            // Chamada à API de registro.
            // IMPORTANTE: credentials: "include" → habilita cookies (refresh HttpOnly).
            const res = await fetch(`${API_BASE_URL}/api/usuarios/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }, // corpo é JSON
                credentials: "include", // recebe/enviar cookies (refresh HttpOnly)
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    recaptchaToken: captchaToken, // envia token para o backend validar
                }),
            });

            // Tentamos ler JSON mesmo se der erro, para extrair "erro" da API.
            // Se o corpo vier vazio ou inválido, caímos no objeto {}.
            const data = await res.json().catch(() => ({}));

            // Qualquer status fora da faixa 200–299 entra aqui como erro.
            if (!res.ok) {
                throw new Error(data?.erro || "Falha no registro");
            }

            // Esperamos um access_token no corpo da resposta.
            const at = data?.access_token;
            if (!at) throw new Error("Resposta sem access_token");

            // Guardamos APENAS o access token (curta duração) na sessionStorage.
            // O refresh token NÃO é salvo aqui; ele está no cookie HttpOnly (invisível ao JS).
            sessionStorage.setItem("at", at);

            // Atualiza imediatamente o contexto de autenticação.
            try {
                const decoded = jwtDecode(at); // { sub, email, nome, exp, ... }
                setUser(decoded);
            } catch (e) {
                console.error("Falha ao decodificar access_token no registro:", e);
                setUser(null);
            }

            // (Opcional) limpa a senha do estado
            setSenha("");
            // (Opcional) limpa o reCAPTCHA
            setCaptchaToken(null);

            // Redireciona para a página inicial (ou para "/chamados", se preferir)
            navigate("/");
        } catch (error) {
            // Exibe mensagem de erro no toast (vinda da API ou genérica).
            setError(error.message || "Erro inesperado");
        } finally {
            // Independentemente de sucesso/erro, finaliza o estado de loading.
            setLoading(false);
        }
    }

    return (
        <div>
            {/* Toast simples de erro (usa classes do Bootstrap).
         Renderiza somente quando "error" tem conteúdo. */}
            {error && <Toast error={error} setError={setError} />}

            {/* Formulário controlado:
          - value vem do estado
          - onChange atualiza o estado */}
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
                        required // atributo HTML: impede submit se estiver vazio
                        placeholder="Digite seu nome"
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

                {/* Botão desabilita enquanto loading=true
                    e também se o reCAPTCHA não estiver marcado */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !captchaToken}
                >
                    {loading ? "Registrando…" : "Registrar"}
                </button>
            </form>
        </div>
    );
};

export default UsuariosFormRegister;
