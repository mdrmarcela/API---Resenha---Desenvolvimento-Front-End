import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "../../auth/useAuthFetch";
import Toast from "../shared/Toast";

const LivrosList = () => {
  const authFetch = useAuthFetch();

  const [livros, setLivros] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function carregar(signal) {
    setError("");
    setLoading(true);

    try {
      const res = await authFetch("/livros", { method: "GET", signal });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.erro || "Erro ao listar livros");
      setLivros(Array.isArray(data) ? data : []);
    } catch (e) {
      if (e?.name !== "AbortError") setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const ac = new AbortController();
    carregar(ac.signal);
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const livrosFiltrados = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return livros;
    return livros.filter((l) => {
      const t = `${l.titulo ?? ""} ${l.autor ?? ""} ${l.isbn ?? ""} ${l.genero ?? ""}`.toLowerCase();
      return t.includes(term);
    });
  }, [livros, q]);

  async function deletarLivro(id) {
    if (!confirm("Excluir livro?")) return;

    setError("");
    const res = await authFetch(`/livros/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.erro || "Erro ao excluir livro");
      return;
    }
    await carregar();
  }

  if (loading) return <p>Carregando livros...</p>;

  return (
    <div className="mt-3">
      {error && <Toast error={error} setError={setError} />}

      <input
        className="form-control mb-3"
        placeholder="Buscar por título, autor, ISBN..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {livrosFiltrados.length === 0 && !error && (
        <div className="alert alert-secondary">Nenhum livro encontrado.</div>
      )}

      <div className="list-group">
        {livrosFiltrados.map((livro) => (
          <div
            key={livro.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{livro.titulo}</strong>
              <div className="text-muted">
                {livro.autor} • ISBN: {livro.isbn}
                {livro.genero ? ` • ${livro.genero}` : ""}
              </div>
            </div>

            <div className="d-flex gap-2">
              <Link to={`/livros/${livro.id}`} className="btn btn-sm btn-primary">
                Detalhes
              </Link>
              <Link to={`/livros/${livro.id}/edit`} className="btn btn-sm btn-outline-secondary">
                Editar
              </Link>
              <button onClick={() => deletarLivro(livro.id)} className="btn btn-sm btn-outline-danger">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivrosList;
