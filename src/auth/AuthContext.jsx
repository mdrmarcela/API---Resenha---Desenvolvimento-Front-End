// src/auth/AuthContext.jsx

// -----------------------------------------------------------------------------
// OBJETIVO DESTE ARQUIVO
// -----------------------------------------------------------------------------
// Este arquivo centraliza TODA a lógica de autenticação no front-end usando
// React Context.
//
// A ideia é:
//
// 1) Guardar o estado do usuário logado (user) em um Contexto global.
// 2) Ler o access_token (JWT de curta duração) da sessionStorage, quando existir.
// 3) Se o access_token não existir ou estiver expirado, tentar renovar a sessão
//    silenciosamente chamando /api/usuarios/refresh, que usa o refresh_token
//    guardado em um cookie HttpOnly pelo backend.
// 4) Expor para o resto da aplicação:
//      - user        → dados do usuário logado (decodificados do JWT)
//      - setUser     → função para atualizar o usuário (ex.: logout)
//      - authLoading → indica se ainda estamos “descobrindo” se o usuário está logado
//
// Assim, ao abrir o site, o fluxo fica:
//  - Carrega AuthProvider
//  - Ele tenta reaproveitar o access_token salvo (sessionStorage)
//  - Se não der, tenta usar o refresh_token do cookie (chamando /refresh)
//  - Se tudo der certo, o usuário continua logado mesmo após fechar/abrir o navegador.
// -----------------------------------------------------------------------------

import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// URL base do backend (definida no .env do Vite, ex.: VITE_API_BASE_URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// -----------------------------------------------------------------------------
// Criação do Contexto de Autenticação
// -----------------------------------------------------------------------------
// Aqui definimos qual é a “forma” do contexto de autenticação.
//
// - user:      objeto com dados do usuário (ex.: { sub: 1, email: "...", tipo: "..." })
// - setUser:   função para atualizar o user (ex.: login, logout)
// - authLoading: indica se ainda estamos carregando/verificando a autenticação
//
// O createContext recebe um valor padrão, usado apenas se alguém usar o contexto
// fora de um AuthProvider (evitar erro em tempo de execução).
const AuthContext = createContext({
    user: null,
    setUser: () => {},
    authLoading: true,
});

// -----------------------------------------------------------------------------
// Componente AuthProvider
// -----------------------------------------------------------------------------
// Este componente envolve a aplicação (normalmente em src/main.jsx ou src/App.jsx)
// e fornece o AuthContext para todos os componentes filhos via Provider.
//
// Tudo que estiver dentro de <AuthProvider> terá acesso ao contexto por meio
// do hook useAuth (que você provavelmente definiu em outro arquivo).
const AuthProvider = ({ children }) => {
    // user: guarda o usuário logado (informações decodificadas do JWT)
    const [user, setUser] = useState(null);

    // authLoading: enquanto TRUE, a aplicação entende que ainda está “descobrindo”
    // se existe uma sessão válida (ex.: usando refresh_token).
    const [authLoading, setAuthLoading] = useState(true);

    // -------------------------------------------------------------------------
    // useEffect de inicialização da autenticação
    // -------------------------------------------------------------------------
    // Este efeito roda apenas uma vez (por causa do array de dependências vazio [])
    // quando o AuthProvider é montado.
    //
    // Objetivo:
    //  1) Ver se existe um access_token válido na sessionStorage.
    //  2) Se não existir ou estiver expirado, chamar /api/usuarios/refresh
    //     para tentar obter um novo access_token usando o refresh_token
    //     armazenado pelo backend em um cookie HttpOnly.
    useEffect(() => {
        // Função assíncrona que encapsula toda a lógica de “boot” da autenticação.
        const bootstrapAuth = async () => {
            try {
                // -----------------------------------------------------------------
                // 1) Tentar reaproveitar o access_token salvo na sessionStorage
                // -----------------------------------------------------------------
                //
                // A sessionStorage guarda dados enquanto a aba/janela está aberta.
                // Se o usuário fechar o navegador, a sessionStorage é apagada,
                // mas o refresh_token continua salvo como cookie HttpOnly (no backend).
                const storedToken = sessionStorage.getItem("at"); // "at" = access token

                // Se encontramos um access_token armazenado:
                if (storedToken) {
                    try {
                        // Decodifica o JWT para extrair as informações (payload)
                        // sem precisar consultar o backend.
                        const decoded = jwtDecode(storedToken);

                        // decoded.exp normalmente é um timestamp em segundos.
                        // Aqui verificamos:
                        //  - se não existe exp (sem tempo de expiração declarado), usamos assim mesmo
                        //  - se exp * 1000 (transformando para ms) ainda é maior que Date.now(),
                        //    significa que o token ainda não expirou → pode usar direto.
                        if (!decoded.exp || decoded.exp * 1000 > Date.now()) {
                            // Token ainda é válido → consideramos o usuário logado
                            setUser(decoded);
                            // IMPORTANTE: retornamos aqui para NÃO tentar o fluxo de refresh,
                            // pois já temos um access_token utilizável.
                            return;
                        }
                        // Se cair aqui, é porque o token expirou e vamos tentar o refresh.
                    } catch (err) {
                        // Se o jwtDecode falhar (token inválido, corrompido, etc.),
                        // removemos o token da sessionStorage e seguimos para o fluxo
                        // de refresh (baseado em cookie).
                        console.error("Token inválido na sessionStorage:", err);
                        sessionStorage.removeItem("at");
                    }
                }

                // -----------------------------------------------------------------
                // 2) Não existe access_token válido → tentar usar refresh_token
                // -----------------------------------------------------------------
                //
                // Neste ponto, ou:
                //  - Não havia token na sessionStorage
                //  - Ou havia, mas expirou / era inválido
                //
                // O refresh_token NÃO fica disponível em JavaScript; ele é um cookie
                // com flag HttpOnly, então só o backend tem acesso a ele.
                //
                // O que fazemos aqui é chamar o endpoint /api/usuarios/refresh.
                // Se o refresh_token estiver OK, o backend responde com um novo
                // access_token (JWT) que podemos guardar e usar no front.
                try {
                    const res = await fetch(
                        `${API_BASE_URL}/api/usuarios/refresh`,
                        {
                            method: "POST",
                            // credentials: "include" é FUNDAMENTAL aqui:
                            // diz ao navegador para enviar cookies (incluindo o
                            // refresh_token HttpOnly) junto com a requisição.
                            credentials: "include",
                        }
                    );

                    // Se o backend retornar erro (ex.: 401, 403, 500), significa que:
                    //  - o refresh_token expirou,
                    //  - foi revogado,
                    //  - ou não está presente.
                    // Nesse caso, consideramos que não há mais sessão válida.
                    if (!res.ok) {
                        sessionStorage.removeItem("at");
                        setUser(null);
                        return;
                    }

                    // Tentamos ler a resposta JSON (pode lançar erro se não for JSON)
                    const data = await res.json().catch(() => ({}));

                    // Esperamos que o backend envie { access_token: "..." }
                    const newToken = data?.access_token;

                    // Se não veio access_token, não temos como autenticar o usuário.
                    if (!newToken) {
                        sessionStorage.removeItem("at");
                        setUser(null);
                        return;
                    }

                    // Salvamos o novo access_token na sessionStorage,
                    // assim as próximas recargas de página podem tentar usá-lo direto.
                    sessionStorage.setItem("at", newToken);

                    // Agora decodificamos o novo token para preencher o estado "user".
                    try {
                        const decoded = jwtDecode(newToken);
                        setUser(decoded); // Usuário autenticado com sucesso
                    } catch (err) {
                        // Se, por algum motivo, o JWT retornado for inválido,
                        // registramos o erro e consideramos que não há sessão.
                        console.error(
                            "Falha ao decodificar token vindo do /refresh:",
                            err
                        );
                        setUser(null);
                    }
                } catch (err) {
                    // Qualquer erro de rede (sem internet, backend fora do ar, etc.)
                    // também faz com que a sessão seja considerada inválida.
                    console.error("Erro ao chamar /api/usuarios/refresh:", err);
                    setUser(null);
                }
            } finally {
                // -----------------------------------------------------------------
                // Final do boot de autenticação
                // -----------------------------------------------------------------
                //
                // Independente de ter dado certo ou errado:
                //  - Já tentamos reaproveitar o access_token
                //  - Já tentamos usar o refresh_token (cookie HttpOnly)
                //
                // Agora podemos dizer para a aplicação que a fase de "authLoading"
                // terminou. A partir daqui, os componentes podem decidir o que
                // renderizar (rotas públicas, rotas privadas, etc.).
                setAuthLoading(false);
            }
        };

        // Executa a função de inicialização assim que o componente é montado.
        bootstrapAuth();
    }, []); // [] → executa apenas uma vez, quando o AuthProvider é carregado

    // -------------------------------------------------------------------------
    // Retorno do Provider
    // -------------------------------------------------------------------------
    // Aqui disponibilizamos o contexto para toda a árvore de componentes.
    //
    // Qualquer componente dentro de <AuthProvider> pode usar:
    //   const { user, setUser, authLoading } = useAuth();
    //
    // - user: objeto do usuário logado (ou null, se não estiver logado)
    // - setUser: útil para fazer logout manual (ex.: setUser(null))
    // - authLoading: enquanto true, a aplicação ainda está verificando a sessão
    return (
        <AuthContext.Provider value={{ user, setUser, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Exportamos o AuthContext (para usar com useContext em um hook customizado)
// e o AuthProvider (para envolver a aplicação em src/main.jsx ou src/App.jsx).
export { AuthContext, AuthProvider };
