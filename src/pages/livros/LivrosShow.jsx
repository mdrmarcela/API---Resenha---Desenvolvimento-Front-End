import Navbar from "../../components/shared/Navbar";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../../auth/useAuthFetch";
import { useAuth } from "../../auth/useAuth";

const LivrosShow = () => {
  const { id } = useParams();
  const { user, authLoading } = useAuth();
  const authFetch = useAuthFetch();

  const [livro, setLivro] = useState(null);
  const [resenhas, setResenhas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");

  const [form, setForm] = useState({ titulo: "", conteudo: "", nota: 5 });

  async function carregar() {
    setErro("");
    setOk("");
    setLoading(true);

    try {
      const resLivro = await authFetch(`/livros/${id}`);
      const dataLivro = await resLivro.json().catch(() => ({}));
      if (!resLivro.ok) throw new Error(dataLivro?.erro || "Erro ao carregar livro");
      setLivro(dataLivro);

      const resRes = await authFetch(`/livros/${id}/resenhas`);
      const dataRes = await resRes.json().catch(() => ({}));
      if (!resRes.ok) throw new Error(dataRes?.erro || "Erro ao listar resenhas");
      setResenhas(Array.isArray(dataRes) ? dataRes : []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function criarResenha(e) {
    e.preventDefault();
    setErro("");
    setOk("");

    if (!user?.id) {
      setErro("Usuário logado sem id (verifique o login).");
      return;
    }

    const body = {
      titulo: form.titulo.trim(),
      conteudo: form.conteudo.trim(),
      nota: Number(form.nota),
      usuario_id: user.id, 
    };

    try {
      const res = await authFetch(`/livros/${id}/resenhas`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.erro || "Erro ao criar resenha");

      setForm({ titulo: "", conteudo: "", nota: 5 });
      setOk("Resenha criada!");
      await carregar();
    } catch (e2) {
      setErro(e2.message);
    }
  }

  async function deletarResenha(resenhaId) {
    if (!confirm("Excluir resenha?")) return;
    setErro("");
    setOk("");

    const res = await authFetch(`/livros/${id}/resenhas/${resenhaId}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErro(data?.erro || "Erro ao excluir resenha");
      return;
    }

    setOk("Resenha excluída!");
    await carregar();
  }

  if (authLoading) return <p>Carregando usuário...</p>;
  if (!user) return <Navigate to="/usuarios/login" replace />;

  return (
    <div>
      <Navbar />

      <div className="container mt-3">
        <Link to="/livros" className="btn btn-outline-secondary">
          Voltar
        </Link>

        {erro && <div className="alert alert-danger mt-3">{erro}</div>}
        {ok && <div className="alert alert-success mt-3">{ok}</div>}
        {loading && <div className="alert alert-info mt-3">Carregando...</div>}

        {!loading && livro && (
          <>
            <div className="d-flex justify-content-between align-items-start mt-3">
              <div>
                <h2>{livro.titulo}</h2>
                <div className="text-muted">
                  {livro.autor} • ISBN: {livro.isbn}
                  {livro.genero ? ` • ${livro.genero}` : ""}
                </div>
              </div>

              <Link className="btn btn-outline-secondary" to={`/livros/${id}/edit`}>
                Editar livro
              </Link>
            </div>

            <hr />

            <h4>Resenhas</h4>
            <div className="list-group mt-3">
              {resenhas.map((r) => (
                <div key={r.id} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <strong>{r.titulo}</strong>
                    <span>Nota: {r.nota}</span>
                  </div>

                  <div className="mt-2">{r.conteudo}</div>

                  <div className="d-flex gap-2 mt-3">
                    <Link className="btn btn-sm btn-outline-secondary" to={`/livros/${id}/resenhas/${r.id}/edit`}>
                      Editar
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deletarResenha(r.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}

              {resenhas.length === 0 && (
                <div className="alert alert-secondary mt-3">Nenhuma resenha ainda. </div>
              )}
            </div>

            <hr />

            <h4>Nova resenha</h4>
            <form onSubmit={criarResenha} className="mt-3" style={{ maxWidth: 720 }}>
              <input
                className="form-control mb-2"
                placeholder="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
              />

              <textarea
                className="form-control mb-2"
                placeholder="Conteúdo"
                value={form.conteudo}
                onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
                required
              />

              <input
                type="number"
                min={1}
                max={5}
                className="form-control mb-3"
                value={form.nota}
                onChange={(e) => setForm({ ...form, nota: e.target.value })}
                required
              />

              <button className="btn btn-success">Publicar</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LivrosShow;