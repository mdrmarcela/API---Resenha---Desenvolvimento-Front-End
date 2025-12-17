import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../shared/Toast";
import { useAuthFetch } from "../../auth/useAuthFetch";
import { useAuth } from "../../auth/useAuth";

const ResenhaEditForm = ({ resenha }) => {
  const { livro_id, id } = useParams();
  const { user } = useAuth();
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState(resenha?.titulo || "");
  const [conteudo, setConteudo] = useState(resenha?.conteudo || "");
  const [nota, setNota] = useState(resenha?.nota ?? 5);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitForm(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        nota: Number(nota),
        usuario_id: user?.id, // obrigatório no schema
      };

      const res = await authFetch(`/livros/${livro_id}/resenhas/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.erro || "Erro ao atualizar resenha");

      navigate(`/livros/${livro_id}`);
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitForm} className="m-2" style={{ maxWidth: 720 }}>
      {error && <Toast error={error} setError={setError} />}

      <div className="my-2">
        <label htmlFor="id-input-titulo" className="form-label">
          Título
        </label>
        <input
          className="form-control"
          type="text"
          id="id-input-titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título da resenha"
          required
        />
      </div>

      <div className="my-2">
        <label htmlFor="id-input-conteudo" className="form-label">
          Conteúdo
        </label>
        <textarea
          className="form-control"
          id="id-input-conteudo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="Escreva sua resenha"
          required
        />
      </div>

      <div className="my-2">
        <label htmlFor="id-input-nota" className="form-label">
          Nota (1 a 5)
        </label>
        <input
          className="form-control"
          type="number"
          min={1}
          max={5}
          id="id-input-nota"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          required
        />
      </div>

      <div className="my-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};

export default ResenhaEditForm;
