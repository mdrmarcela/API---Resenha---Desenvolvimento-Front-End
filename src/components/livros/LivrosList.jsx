import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "../../auth/useAuthFetch";
import Toast from "../shared/Toast";

const LivrosList = () => {
  const authFetch = useAuthFetch();

  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("titulo_asc"); // titulo_asc | titulo_desc | autor_asc | autor_desc | id_desc | id_asc
  const [busyId, setBusyId] = useState(null);

  async function carregar() {
    setError("");
    setLoading(true);
    try {
      const res = await authFetch("/livros");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.erro || "Erro ao listar livros");
      setLivros(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function deletar(id) {
    if (!confirm("Excluir este livro? Isso também remove as resenhas vinculadas (se o back estiver configurado assim).")) {
      return;
    }

    setError("");
    setBusyId(id);

    try {
      const res = await authFetch(`/livros/${id}`, { method: "DELETE" });
      // seu back pode retornar 204 sem body
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.erro || "Erro ao excluir livro");
      }
      await carregar();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  const livrosFiltrados = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return livros;

    return livros.filter((l) => {
      const t = (l.titulo || "").toLowerCase();
      const a = (l.autor || "").toLowerCase();
      const i = (l.isbn || "").toLowerCase();
      const g = (l.genero || "").toLowerCase();
      return t.includes(term) || a.includes(term) || i.includes(term) || g.includes(term);
    });
  }, [livros, q]);

  const livrosOrdenados = useMemo(() => {
    const arr = [...livrosFiltrados];

    const byText = (a, b, field, dir) => {
      const av = (a?.[field] || "").toString();
      const bv = (b?.[field] || "").toString();
      const r = av.localeCompare(bv, "pt-BR", { sensitivity: "base" });
      return dir === "asc" ? r : -r;
    };

    switch (sort) {
      case "titulo_desc":
        return arr.sort((a, b) => byText(a, b, "titulo", "desc"));
      case "autor_asc":
        return arr.sort((a, b) => byText(a, b, "autor", "asc"));
      case "autor_desc":
        return arr.sort((a, b) => byText(a, b, "autor", "desc"));
      case "id_asc":
        return arr.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      case "id_desc":
        return arr.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      case "titulo_asc":
      default:
        return arr.sort((a, b) => byText(a, b, "titulo", "asc"));
    }
  }, [livrosFiltrados, sort]);

  if (loading) {
    return <div className="alert alert-info mb-0">Carregando livros...</div>;
  }

  return (
    <div>
      {error && <Toast error={error} setError={setError} />}

      {/* Barra de ações (busca + ordenação + atualizar) */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-lg-6">
              <label className="form-label mb-1">Buscar</label>
              <input
                className="form-control"
                placeholder="Digite título, autor, ISBN ou gênero..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="col-12 col-lg-4">
              <label className="form-label mb-1">Ordenar por</label>
              <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="titulo_asc">Título (A-Z)</option>
                <option value="titulo_desc">Título (Z-A)</option>
                <option value="autor_asc">Autor (A-Z)</option>
                <option value="autor_desc">Autor (Z-A)</option>
                <option value="id_desc">Mais recentes</option>
                <option value="id_asc">Mais antigos</option>
              </select>
            </div>

            <div className="col-12 col-lg-2 d-grid">
              <label className="form-label mb-1 opacity-0">.</label>
              <button className="btn btn-outline-secondary" onClick={carregar}>
                Atualizar
              </button>
            </div>
          </div>

          <div className="text-muted mt-2">
            Mostrando <strong>{livrosOrdenados.length}</strong> de <strong>{livros.length}</strong>
          </div>
        </div>
      </div>

      {/* Lista */}
      {livrosOrdenados.length === 0 ? (
        <div className="alert alert-secondary mb-0">
          Nenhum livro encontrado. Tente outra busca ou clique em <strong>“Criar Livro”</strong>.
        </div>
      ) : (
        <div className="list-group">
          {livrosOrdenados.map((l) => (
            <div key={l.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div style={{ minWidth: 0 }}>
                  <div className="fw-bold text-truncate">{l.titulo}</div>
                  <div className="text-muted">
                    {l.autor} • ISBN: {l.isbn}
                    {l.genero ? ` • ${l.genero}` : ""}
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <Link className="btn btn-sm btn-outline-primary" to={`/livros/${l.id}`}>
                    Detalhes
                  </Link>

                  <Link className="btn btn-sm btn-outline-secondary" to={`/livros/${l.id}/edit`}>
                    Editar
                  </Link>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deletar(l.id)}
                    disabled={busyId === l.id}
                  >
                    {busyId === l.id ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LivrosList;
