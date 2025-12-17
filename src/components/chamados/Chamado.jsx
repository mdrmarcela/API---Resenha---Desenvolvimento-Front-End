// src/components/Chamado.jsx
//
// OBJETIVO
// -----------------------------------------------------------------------------
// Este componente é responsável por renderizar UM cartão de chamado e permitir
// que o usuário alterne o seu estado (ativo/inativo) diretamente no backend,
// usando o helper de requisições autenticadas (useAuthFetch).
//
// VISÃO GERAL
// -----------------------------------------------------------------------------
// - useAuthFetch: devolve uma função de busca autenticada (authFetch) que:
//     * Anexa Authorization: Bearer <access_token> (se existir em sessionStorage);
//     * Envia cookies (para o refresh_token HttpOnly);
//     * Tenta renovar o access token automaticamente quando a API responder 401;
//     * Refaz a requisição original uma única vez após o refresh.
// - Props:
//     * chamado: objeto com dados do chamado (id, texto, estado, url_imagem, etc.);
//     * setError: função vinda do componente pai para exibir mensagens de erro (ex.: toast);
//     * onChamadoEstadoChange: callback que o pai usa para atualizar a lista
//       local quando o backend devolve o chamado atualizado.
// - Interação principal:
//     * O botão "Ativo/Inativo" dispara um PATCH /api/chamados/:id trocando o
//       campo "estado" entre 'a' (ativo) e 'f' (fechado) e, em caso de sucesso,
//       notifica o pai via onChamadoEstadoChange(...).
//
// -----------------------------------------------------------------------------
// Abaixo está a implementação do componente, com comentários linha a linha.

import { Link } from 'react-router-dom';
import { useAuthFetch } from '../../auth/useAuthFetch';
import { useAuth } from '../../auth/useAuth';

// Pega a API_BASE_URL da variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import fallbackImg from './assets/imagemErro404.png';

// Componente responsável por renderizar UM chamado da lista.
// Props:
// - chamado: objeto com dados do chamado (id, texto, estado, url_imagem, etc.).
// - setError: função recebida do pai para exibir mensagens de erro (ex.: toast).
// - onChamadoEstadoChange: callback disparado quando o PATCH no backend
//   retorna o chamado atualizado; o pai usa isso para substituir o item na lista.
const Chamado = ({ chamado, setError, onChamadoEstadoChange, onChamadoDelete }) => {
    // Obtém a função authFetch (um "fetch" com autenticação + refresh automático).
    const authFetch = useAuthFetch();
    const { user, authLoading } = useAuth(); // agora vem do contexto
    const currentUserId = user?.sub;
    const currentUserIsAdmin = user?.papel == 1;

    // Handler do botão que alterna o estado do chamado (a <-> f).
    // a  = ativo/aberto
    // f  = fechado/inativo
    const handleEstadoChange = async () => {
        // Monta a URL do recurso que será atualizado (PATCH /api/chamados/:id).
        const url = `${API_BASE_URL}/api/chamados/${chamado.id}`;

        // Prepara o corpo da requisição. Aqui enviamos apenas o campo "estado"
        // trocando 'a' por 'f' e vice-versa. O backend fará a atualização parcial (PATCH).
        const payload = JSON.stringify({
            estado: chamado.estado === 'a' ? 'f' : 'a',
        });

        try {
            // Faz a chamada usando o helper autenticado.
            // Importante: adicionamos Content-Type: application/json porque o body é JSON.
            // O authFetch cuida de:
            //   - anexar Authorization: Bearer <token> (se existir);
            //   - credentials: 'include' (envio de cookies);
            //   - tentar /refresh em caso de 401 e refazer a requisição 1x.
            const res = await authFetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
            });

            // Se a resposta NÃO for ok (status 2xx), tentamos ler um JSON de erro do backend
            // e lançamos uma exceção com uma mensagem amigável.
            if (!res.ok) {
                const body = await res.json().catch(() => null); // se não for JSON, ignora
                throw new Error(`Erro HTTP: ${res.status}. ${body?.erro ?? ``}`);
            }

            // Quando o backend responde 200/204 (ou similar) com o registro atualizado,
            // lemos o JSON e avisamos o componente pai para atualizar a lista local.
            const data = await res.json();
            onChamadoEstadoChange(data);
        } catch (error) {
            // Qualquer erro (rede, backend, parse de JSON, etc.) cai aqui.
            // Encaminhamos a mensagem para o pai mostrar (ex.: toast).
            setError(error.message);
        }
    };

    const handleChamadoDelete = async () => {
        const url = `${API_BASE_URL}/api/chamados/${chamado.id}`;

        try {
            const res = await authFetch(url, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null); // se não for JSON, ignora
                throw new Error(`Erro HTTP: ${res.status}. ${body?.erro ?? ``}`);
            }

            onChamadoDelete(chamado.id);
        } catch (error) {
            setError(error.message);
        }
    };

    // Enquanto ainda está carregando o estado de auth, não decide redirecionar
    if (authLoading) {
        return null;
    }

    // Abaixo está apenas a renderização do cartão do chamado (UI).
    return (
        <div>
            <div className="card m-2">
                <div className="card-header">
                    <div className='d-flex justify-content-between'>
                        <span>Chamado <strong>#{chamado.id}</strong> </span>
                        <span>Criado por: {' '} <strong>{chamado.nome}</strong></span>
                    </div>
                </div>
                <div className="card-body">
                    <Link to={`/chamados/${chamado.id}`} className='text-body text-decoration-none'>
                        {/* Se houver imagem, tenta exibir; se der erro no carregamento, usa um fallback local */}
                        {chamado.url_imagem && (
                            <img
                                className="me-2 rounded"
                                width={40}
                                src={chamado.url_imagem}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;      // evita loop infinito
                                    e.currentTarget.src = fallbackImg;
                                }}
                            />
                        )}
                        <span>{chamado.texto}</span>
                    </Link>
                </div>
                <div className="card-footer text-body-secondary">
                    {/* Botão que alterna o estado do chamado.
              Ao clicar, dispara handleEstadoChange (PATCH). */}
                    {chamado.estado === 'a' && (
                        <button
                            className="btn btn-success me-2"
                            onClick={handleEstadoChange}
                            disabled={!currentUserIsAdmin && currentUserId != chamado.Usuarios_id}
                        >
                            Aberto
                        </button>
                    )}
                    {chamado.estado === 'f' && (
                        <button
                            className="btn btn-secondary me-2"
                            onClick={handleEstadoChange}
                            disabled={!currentUserIsAdmin && currentUserId != chamado.Usuarios_id}
                        >
                            Fechado
                        </button>
                    )}

                    {/* Botões "Editar" e "Remover" estão presentes para futuras ações. */}
                    {(currentUserId == chamado.Usuarios_id || currentUserIsAdmin) && <Link to={`/chamados/${chamado.id}/edit`} className="btn btn-info me-2 text-white">Editar</Link>}
                    {/* Remoção somente para ADMIN */}
                    {(currentUserIsAdmin) && <button className="btn btn-danger me-2" onClick={handleChamadoDelete}>Remover</button>}
                </div>
            </div>
        </div>
    );
};

export default Chamado;

