// src/components/ChamadosList.jsx

import { useState, useEffect } from "react";
import Chamado from "./Chamado";
import { useAuthFetch } from "../../auth/useAuthFetch";
import Toast from "../shared/Toast";
import ChamadosListFilter from "./ChamadosListFilter";

// Pega a API_BASE_URL da variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function filtrarPorEstado(lista, estado) {
    if (!estado) return lista; // "" = todos
    return lista.filter((ch) => ch.estado === estado);
}

const ChamadosList = () => {
    // Lê cache do localStorage (se existir)
    let chamadosCache = null;
    try {
        chamadosCache = JSON.parse(localStorage.getItem("chamadosCache"));
    } catch {
        chamadosCache = null;
    }

    // filtro salvo em localStorage como string simples ("", "a", "f")
    let estadoSelecionadoCache = localStorage.getItem(
        "chamadosEstadoSelecionadoCache"
    );
    if (estadoSelecionadoCache === null) {
        estadoSelecionadoCache = "a"; // padrão = "Abertos"
    }

    // Fonte de verdade: lista completa
    const [allChamados, setAllChamados] = useState(chamadosCache ?? []);

    // Filtro selecionado pelo usuário
    const [estadoFilter, setEstadoFilter] = useState(estadoSelecionadoCache); // "", "a", "f"

    const [loading, setLoading] = useState(chamadosCache ? false : true);
    const [error, setError] = useState(null);

    const authFetch = useAuthFetch();

    // 1) Efeito para BUSCAR os chamados da API periodicamente
    useEffect(() => {
        const abortController = new AbortController();

        const fetchChamados = async () => {
            try {
                const res = await authFetch(`${API_BASE_URL}/api/chamados`, {
                    method: "GET",
                    signal: abortController.signal,
                });
                if (!res.ok) {
                    const body = await res.json().catch(() => null); // se não for JSON, ignora
                    throw new Error(`Erro HTTP: ${res.status}. ${body?.erro ?? ``}`);
                }
                if (res.status === 304) return;

                const data = await res.json();

                // Atualiza a fonte de verdade e o cache bruto
                setAllChamados(data);
                localStorage.setItem("chamadosCache", JSON.stringify(data));
            } catch (error) {
                if (error?.name === "AbortError") return;
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChamados();
        const interval5secs = setInterval(fetchChamados, 5000);

        return () => {
            abortController.abort();
            clearInterval(interval5secs);
        };
    }, [authFetch]);

    // Lista exibida em tela é DERIVADA (não é estado próprio)
    const chamadosVisiveis = filtrarPorEstado(allChamados, estadoFilter);

    // Quando o usuário troca o filtro no <ChamadosListFilter>
    const handleFilterChange = (novoEstado) => {
        setEstadoFilter(novoEstado);
        // salva o valor cru, sem JSON.stringify
        localStorage.setItem("chamadosEstadoSelecionadoCache", novoEstado);
    };

    // Chamado alterado (ex.: mudou estado de "a" para "f")
    const onChamadoEstadoChange = (chamadoAlterado) => {
        setAllChamados((prev) => {
            const novaLista = prev.map((ch) => {
                // Insere o nome que o patch não devolve
                if( ch.id === chamadoAlterado.id )
                {
                    chamadoAlterado.nome = ch.nome
                    return chamadoAlterado 
                }
                return ch
            }
            );
            localStorage.setItem("chamadosCache", JSON.stringify(novaLista));
            return novaLista;
        });
    };

    // Chamado deletado
    const onChamadoDelete = (chamadoDeletadoId) => {
        setAllChamados((prev) => {
            const novaLista = prev.filter((ch) => ch.id !== chamadoDeletadoId);
            localStorage.setItem("chamadosCache", JSON.stringify(novaLista));
            return novaLista;
        });
    };

    if (loading) {
        return <p>Carregando chamados...</p>;
    }

    return (
        <div>
            {error && <Toast error={error} setError={setError} />}

            <ChamadosListFilter value={estadoFilter} onChange={handleFilterChange} />

            {chamadosVisiveis.length === 0 && (
                <p className="mx-2">Nenhum chamado encontrado.</p>
            )}

            {chamadosVisiveis.map((chamado) => (
                <Chamado
                    key={chamado.id}
                    chamado={chamado}
                    setError={setError}
                    onChamadoEstadoChange={onChamadoEstadoChange}
                    onChamadoDelete={onChamadoDelete}
                />
            ))}
        </div>
    );
};

export default ChamadosList;
