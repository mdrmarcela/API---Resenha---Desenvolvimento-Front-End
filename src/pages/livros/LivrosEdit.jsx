import { useEffect, useState } from "react";
import Navbar from "../../components/shared/Navbar";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { useAuthFetch } from "../../auth/useAuthFetch";

const LivrosEdit = () => {
  const { id } = useParams();
  const { user, authLoading } = useAuth();
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ titulo: "", autor: "", genero: "", isbn: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    (async () => {
      setErro("");
      setLoading(true);

      const res = await authFetch(`/livros/${id}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.erro || "Erro ao carregar livro");

      setForm({
        titulo: data.titulo || "",
        autor: data.autor || "",
        genero: data.genero || "",
        isbn: data.isbn || "",
      });

      setLoading(false);
    })().catch((e) => {
      setErro(e.message);
      setLoading(false);
    });
  }, [id]);

  function buildBody() {
    const body = {
      titulo: form.titulo.trim(),
      autor: form.autor.trim(),
      isbn: form.isbn.trim(),
    };
    const genero = form.genero.trim();
    if (genero) body.genero = genero;
    return body;
  }

  async function submit(e) {
    e.preventDefault();
    setErro("");
    setSaving(true);

    try {
      const res = await authFetch(`/livros/${id}`, {
        method: "PUT",
        body: JSON.stringify(buildBody()),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.erro || "Erro ao atualizar livro");

      navigate(`/livros/${id}`);
    } catch (e2) {
      setErro(e2.message);
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) return <p>Carregando usuário...</p>;
  if (!user) return <Navigate to="/usuarios/login" replace />;

  return (
    <div>
      <Navbar />

      <div className="container mt-3" style={{ maxWidth: 720 }}>
        <Link to="/livros" className="btn btn-outline-secondary">
          Voltar
        </Link>

        <h2 className="mt-3">Editar Livro</h2>

        {erro && <div className="alert alert-danger mt-2">{erro}</div>}
        {loading && <div className="alert alert-info mt-2">Carregando...</div>}

        {!loading && (
          <form onSubmit={submit} className="mt-3">
            <input
              className="form-control mb-2"
              placeholder="Título"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
            />
            <input
              className="form-control mb-2"
              placeholder="Autor"
              value={form.autor}
              onChange={(e) => setForm({ ...form, autor: e.target.value })}
              required
            />
            <input
              className="form-control mb-2"
              placeholder="Gênero (opcional)"
              value={form.genero}
              onChange={(e) => setForm({ ...form, genero: e.target.value })}
            />
            <input
              className="form-control mb-3"
              placeholder="ISBN"
              value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })}
              required
            />

            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LivrosEdit;