import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../auth/useAuthFetch";
import Toast from "../shared/Toast";

const LivroFormCreate = () => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [genero, setGenero] = useState("");
  const [isbn, setIsbn] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // schema do back: titulo, autor, isbn obrigatórios; genero opcional (se enviar, não pode ser vazio)
      const body = {
        titulo: titulo.trim(),
        autor: autor.trim(),
        isbn: isbn.trim(),
      };

      const gen = genero.trim();
      if (gen) body.genero = gen;

      const res = await authFetch("/livros", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.erro || "Erro ao criar livro");

      navigate("/livros");
    } catch (err) {
      if (err?.name !== "AbortError") setError(err?.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="m-2" style={{ maxWidth: 720 }}>
      {error && <Toast error={error} setError={setError} />}

      <div className="my-2">
        <label className="form-label" htmlFor="id-input-titulo">
          Título
        </label>
        <input
          className="form-control"
          id="id-input-titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Digite o título"
          required
        />
      </div>

      <div className="my-2">
        <label className="form-label" htmlFor="id-input-autor">
          Autor
        </label>
        <input
          className="form-control"
          id="id-input-autor"
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          placeholder="Digite o autor"
          required
        />
      </div>

      <div className="my-2">
        <label className="form-label" htmlFor="id-input-genero">
          Gênero (opcional)
        </label>
        <input
          className="form-control"
          id="id-input-genero"
          type="text"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          placeholder="Ex.: Fantasia, Romance..."
        />
      </div>

      <div className="my-2">
        <label className="form-label" htmlFor="id-input-isbn">
          ISBN
        </label>
        <input
          className="form-control"
          id="id-input-isbn"
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="Digite o ISBN"
          required
        />
      </div>

      <div className="my-2">
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};

export default LivroFormCreate;