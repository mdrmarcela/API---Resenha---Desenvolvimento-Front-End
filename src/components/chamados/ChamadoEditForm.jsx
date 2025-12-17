import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../../auth/useAuthFetch';
import Toast from '../shared/Toast';
import ReCaptcha from '../shared/ReCaptcha';

// Pega a API_BASE_URL da variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChamadoEditForm = ({ chamado }) => {
    const [texto, setTexto] = useState(chamado.texto);
    const [estado, setEstado] = useState(chamado.estado);
    const [imagem, setImagem] = useState(null);
    const [hasImagem, setHasImagem] = useState(chamado.url_imagem ? true : false);
    const [error, setError] = useState(null);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [loading, setLoading] = useState(false); // controla ciclo de envio/patch

    const navigate = useNavigate();
    const authFetch = useAuthFetch();

    const submitForm = async (e) => {
        e.preventDefault();

        // Exige o reCAPTCHA antes de enviar
        if (!captchaToken) {
            setError('Por favor, confirme o reCAPTCHA antes de atualizar o chamado.');
            return;
        }

        // 1. Crie um novo objeto FormData
        const formData = new FormData();

        // 2. Adicione todos os campos do formulário
        formData.append('texto', texto);
        formData.append('estado', estado);
        if (imagem) {
            formData.append('imagem', imagem); // 'imagem' é a chave para o arquivo
        }
        // Token do reCAPTCHA para o backend validar
        formData.append('recaptchaToken', captchaToken);

        setLoading(true);
        try {
            // 3. Envia a requisição para a API
            const response = await authFetch(`${API_BASE_URL}/api/chamados/${chamado.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                // Se a resposta não for OK, lança um erro
                const erro = await response.json().catch(() => ({}));
                throw new Error(erro.erro || `Erro HTTP: ${response.status}`);
            }

            // Faz o parse do json recebido (se precisar do retorno)
            await response.json().catch(() => ({}));

            navigate(`/chamados`);
        } catch (error) {
            // Se a requisição foi cancelada com AbortController, ignore.
            // Caso contrário, exiba a mensagem no toast.
            if (error?.name !== 'AbortError') setError(error.message);
        } finally {
            // encerrou a tentativa (sucesso ou erro)
            setLoading(false);
            // o ReCaptcha.jsx vai ver loading true→false, resetar o widget e limpar o token
        }
    }

    // Função assíncrona para remover a imagem do chamado
    const deleteImageChamado = async () => {
        // Exige o reCAPTCHA também para remover a imagem
        if (!captchaToken) {
            setError('Por favor, confirme o reCAPTCHA antes de excluir a imagem do chamado.');
            return;
        }

        setLoading(true);
        try {
            // 2. Envia a requisição para a API
            const response = await authFetch(`${API_BASE_URL}/api/chamados/${chamado.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url_imagem: null,
                    recaptchaToken: captchaToken,
                }), // Envia o campo a ser alterado + token
            });

            if (!response.ok) {
                // Se a resposta não for OK, lança um erro
                const erro = await response.json().catch(() => ({}));
                throw new Error(erro.erro || `Erro HTTP: ${response.status}`);
            }

            // Requisição foi um sucesso, agora atualiza o estado local
            setHasImagem(false);
        } catch (error) {
            // Se a requisição foi cancelada com AbortController, ignore.
            // Caso contrário, exiba a mensagem no toast.
            if (error?.name !== 'AbortError') setError(error.message);
        } finally {
            // terminou a tentativa de PATCH (sucesso ou erro)
            setLoading(false);
            // o ReCaptcha.jsx detecta o fim do loading e reseta o captcha/token
        }
    };

    return (
        <form onSubmit={submitForm} className='m-2'>
            {/* Toast de erro simples. Fica visível quando "error" tem conteúdo. */}
            {error && <Toast error={error} setError={setError} />}

            <div className='my-2'>
                <label htmlFor="id-input-texto" className='form-label'>Texto</label>
                <input
                    className="form-control"
                    type="text"
                    id="id-input-texto"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder='Digite o texto do chamado'
                />
            </div>

            <div className='my-2'>
                <label htmlFor="id-input-estado" className='form-label'>Estado</label>
                <select
                    className="form-control"
                    id="id-input-estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                >
                    <option value="a">Aberto</option>
                    <option value="f">Fechado</option>
                </select>
            </div>

            <div className='my-2'>
                <label htmlFor="id-input-imagem" className='form-label d-block'>Imagem</label>
                {hasImagem && (
                    <div className='d-inline-flex gap-2'>
                        {chamado.url_imagem && (
                            <>
                                <img
                                    src={chamado.url_imagem}
                                    alt={`Imagem do chamado ${chamado.id}`}
                                    width={100}
                                    height={100}
                                    onError={(e) => {
                                        // Para evitar loops infinitos caso a imagem de fallback também falhe
                                        e.target.onerror = null;
                                        // Define uma imagem de fallback
                                        e.target.src = "https://dummyimage.com/40x40/cccccc/000000.png&text=Error";
                                    }}
                                    className='border border-2 border-dark rounded-circle'
                                />
                                <button
                                    type='button'
                                    className='btn btn-danger'
                                    onClick={deleteImageChamado}
                                    disabled={!captchaToken || loading}
                                >
                                    Excluir
                                </button>
                            </>
                        )}
                    </div>
                )}
                <div>
                    <input
                        className="form-control"
                        type="file"
                        id="id-input-imagem"
                        onChange={(e) => setImagem(e.target.files[0])} // Primeiro dos arquivos selecionados
                    />
                </div>
            </div>

            {/* reCAPTCHA do Google */}
            <div className='my-2'>
                <ReCaptcha
                    setCaptchaToken={setCaptchaToken}
                    loading={loading} // informa ao ReCaptcha quando a tentativa está em andamento
                />
            </div>

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

export default ChamadoEditForm
