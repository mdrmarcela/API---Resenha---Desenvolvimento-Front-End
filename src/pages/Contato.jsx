import Navbar from "../components/shared/Navbar";

const Contato = () => {
  return (
    <div>
      <Navbar />

      <div className="container mt-4" style={{ maxWidth: 900 }}>
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="mb-2">Contato</h2>
            <p className="text-muted">
              Se você quiser, coloque aqui seus links (GitHub/LinkedIn) ou um formulário de contato simples.
            </p>

            <div className="row g-3 mt-2">
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded h-100">
                  <div className="fw-semibold mb-1">Sugestão</div>
                  <div className="text-muted small">
                    Coloque seu e-mail e o link do repositório público (exigido no enunciado).
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 border rounded h-100">
                  <div className="fw-semibold mb-1">Demonstração</div>
                  <div className="text-muted small">
                    Mostre login/logout + CRUD livros + CRUD resenhas.
                  </div>
                </div>
              </div>
            </div>

            {/* Opcional: mini formulário (sem backend) */}
            <hr className="my-4" />
            <h5 className="mb-3">Mensagem (opcional)</h5>

            <form onSubmit={(e) => e.preventDefault()} className="row g-2">
              <div className="col-12 col-md-6">
                <input className="form-control" placeholder="Seu nome" />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control" placeholder="Seu e-mail" type="email" />
              </div>
              <div className="col-12">
                <textarea className="form-control" placeholder="Sua mensagem" rows={4} />
              </div>
              <div className="col-12">
                <button className="btn btn-outline-secondary" type="submit">
                  Enviar (somente visual)
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;
