// src/components/ChamadoFormCreate.jsx
//
// OBJETIVO DO ARQUIVO
// -----------------------------------------------------------------------------
// Este componente exibe um formulário para CRIAR um novo “chamado”.
// Ele guarda os valores digitados em estados locais (useState),
// envia os dados para o backend (POST /api/chamados) e, se der certo,
// redireciona o usuário para a lista de chamados ("/chamados").
//
// -----------------------------------------------------------------------------
// 1) useState: cria “variáveis reativas” para controlar os campos do formulário.
// 2) FormData: usado para enviar texto + arquivo (multipart/form-data).
//    IMPORTANTE: quando usamos FormData, NÃO definimos manualmente o header
//    "Content-Type"; o navegador monta isso automaticamente com o boundary.
// 3) useAuthFetch: é um helper que funciona como o fetch, mas já adiciona
//    o Authorization: Bearer <access_token> (se existir) e tenta RENOVAR
//    o token (via /api/usuarios/refresh) quando recebe 401.
// 4) useNavigate: permite redirecionar o usuário após o envio bem-sucedido.
//
// Fluxo do submit:
//  - Previne o recarregamento da página (e.preventDefault()).
//  - Monta um FormData com os campos e o arquivo (se houver).
//  - Faz POST com authFetch.
//  - Se falhar, mostra um toast de erro; se der certo, navega para "/chamados".

import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../../auth/useAuthFetch';
import Toast from '../shared/Toast';
import ReCaptcha from '../shared/ReCaptcha';

// Pega a API_BASE_URL da variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Componente de formulário para criar um novo chamado.
 * Ele gerencia o estado do formulário, a submissão e a navegação.
 */
const ChamadoFormCreate = () => {
    // Estados controlando os inputs do formulário.
    const [texto, setTexto] = useState("");
    const [estado, setEstado] = useState("a");
    const [imagem, setImagem] = useState(null);

    // Estado para armazenar mensagens de erro e exibir no toast.
    const [error, setError] = useState(null);

    // Token do reCAPTCHA (preenchido pelo componente ReCaptcha).
    const [captchaToken, setCaptchaToken] = useState(null);

    // Indica se há uma requisição em andamento (para UX e pro ReCaptcha resetar no fim)
    const [loading, setLoading] = useState(false);

    // Hook para redirecionar a rota após sucesso.
    const navigate = useNavigate();

    // Nosso “fetch autenticado” (cuida do Bearer e do refresh automático).
    const authFetch = useAuthFetch(); // <<< usa o hook

    // Handler do submit do formulário.
    // Aqui montamos o FormData e enviamos para a API.
    const handleSubmit = async (e) => {
        e.preventDefault(); // evita recarregar a página no submit
        setError(null);     // limpa erro anterior, se houver

        // Se o usuário não marcou o reCAPTCHA, bloqueia o submit
        if (!captchaToken) {
            setError('Por favor, confirme o reCAPTCHA antes de enviar o chamado.');
            return;
        }

        // Monta um corpo multipart/form-data (texto + arquivo).
        const fd = new FormData();
        fd.append('texto', texto);
        fd.append('estado', estado);
        if (imagem) fd.append('imagem', imagem); // só envia se existir
        // Envia também o token do reCAPTCHA para o backend validar
        fd.append('recaptchaToken', captchaToken);

        setLoading(true);
        try {
            // Envia para a API usando o authFetch (igual ao fetch, mas com Bearer/refresh).
            // NÃO defina "Content-Type" manualmente quando usar FormData.
            const response = await authFetch(`${API_BASE_URL}/api/chamados`, {
                method: 'POST',
                body: fd
            });

            // Se a API respondeu com erro (4xx/5xx), tentamos extrair a msg de erro
            // e lançamos uma exceção para cair no catch.
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.erro
                    ? `Erro HTTP: STATUS ${response.status}. ${errorData?.erro} ${response.statusText}`
                    : `Erro HTTP: STATUS ${response.status}. ${response.statusText}`;
                throw new Error(errorMessage);
            }

            // Sucesso! Redireciona para a lista de chamados.
            navigate("/chamados");
        } catch (error) {
            // Se a requisição foi cancelada com AbortController, ignore.
            // Caso contrário, exiba a mensagem no toast.
            if (error?.name !== 'AbortError') setError(error.message);
        } finally {
            // encerrou a tentativa (com sucesso ou erro)
            setLoading(false);
            // o ReCaptcha.jsx vai detectar loading true→false e resetar o widget + token
        }
    }

    // Renderização do formulário.
    return (
        <form onSubmit={handleSubmit} className='m-2' encType="multipart/form-data">

            {/* Toast de erro simples. Fica visível quando "error" tem conteúdo. */}
            {error && <Toast error={error} setError={setError} />}

            {/* Campo de texto principal do chamado */}
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-texto">Texto</label>
                <input
                    className='form-control'
                    type="text"
                    id="id-input-texto"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder='Digite o texto do chamado'
                />
            </div>

            {/* Select simples para o estado inicial do chamado */}
            <div className='my-2'>
                <label className='form-label' htmlFor="id-select-estado">Estado</label>
                <select
                    id='id-select-estado'
                    className='form-select'
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                >
                    <option value="a">Aberto</option>
                    <option value="f">Fechado</option>
                </select>
            </div>

            {/* Upload de arquivo (imagem). O arquivo real fica em e.target.files[0]. */}
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-imagem">Imagem</label>
                <input
                    className='form-control'
                    type="file"
                    id="id-input-imagem"
                    accept="image/*"
                    onChange={(e) => setImagem(e.target.files?.[0] ?? null)}
                />
            </div>

            {/* reCAPTCHA do Google */}
            <div className='my-2'>
                <ReCaptcha
                    setCaptchaToken={setCaptchaToken}
                    loading={loading}  // informa ao ReCaptcha quando a submissão está em andamento
                />
            </div>

            {/* Botão de envio do formulário.
                Desabilita enquanto o reCAPTCHA não estiver marcado ou enquanto estiver carregando. */}
            <div className='my-2'>
                <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={!captchaToken || loading}
                >
                    {loading ? 'Enviando…' : 'Enviar'}
                </button>
            </div>
        </form>
    )
}

export default ChamadoFormCreate
