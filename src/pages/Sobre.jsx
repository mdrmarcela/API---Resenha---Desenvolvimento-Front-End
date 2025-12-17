import Navbar from "../components/shared/Navbar";
import { Link } from "react-router-dom";

const Badge = ({ children }) => (
  <span className="badge text-bg-secondary me-2 mb-2">{children}</span>
);

const Sobre = () => {
  return (
    <div>
      <Navbar />

      <div className="container mt-4" style={{ maxWidth: 1000 }}>
        <div className="row g-3 align-items-stretch">
          {/* Coluna principal */}
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm h-100">
              <div className="card-body p-4">
                <h2 className="mb-2">Sistema de Resenhas</h2>
                <p className="text-muted mb-3">
                  Um app SPA (React) que consome uma API REST para gerenciar <strong>usuários</strong>,
                  <strong> livros</strong> e <strong>resenhas</strong> com autenticação via <strong>JWT</strong>.
                </p>

                <div className="mb-3">
                  <Badge>React (SPA)</Badge>
                  <Badge>Vite</Badge>
                  <Badge>Bootstrap</Badge>
                  <Badge>JWT Bearer</Badge>
                  <Badge>API REST</Badge>
                </div>

                <div className="alert alert-light border mb-3">
                  <strong>Fluxo mínimo:</strong> registrar → autenticar → acessar área autenticada → sair
                </div>

                <h5 className="mb-2">Como funciona (resumo)</h5>
                <ul className="mb-0">
                  <li>O usuário faz login e recebe um <strong>token JWT</strong>.</li>
                  <li>O front guarda o token na <strong>sessionStorage</strong>.</li>
                  <li>Nas requisições protegidas, envia: <code>Authorization: Bearer {"<token>"}</code>.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Coluna lateral */}
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body p-4">
                <h5 className="mb-3">Atalhos</h5>

                <div className="d-grid gap-2">
                  <Link to="/usuarios/login" className="btn btn-primary">
                    Entrar
                  </Link>
                  <Link to="/usuarios/register" className="btn btn-outline-primary">
                    Criar conta
                  </Link>
                  <Link to="/livros" className="btn btn-success">
                    Ir para Livros
                  </Link>
                </div>

                <hr className="my-4" />

                <h6 className="text-muted mb-2">Arquitetura</h6>
                <div className="p-3 border rounded bg-body-tertiary small">
                  <div><strong>React SPA</strong> → HTTP/JSON</div>
                  <div>→ <strong>API Node/Express</strong></div>
                  <div>→ JWT no header (Bearer)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção pequena e “clean” */}
        <div className="card shadow-sm mt-3">
          <div className="card-body p-4">
            <h5 className="mb-2">O que você consegue fazer</h5>
            <div className="row g-3 mt-1">
              <div className="col-12 col-md-4">
                <div className="p-3 border rounded h-100">
                  <div className="fw-semibold">Usuários</div>
                  <div className="text-muted small">Cadastro, login, listagem e exclusão.</div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3 border rounded h-100">
                  <div className="fw-semibold">Livros</div>
                  <div className="text-muted small">CRUD completo com detalhes.</div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3 border rounded h-100">
                  <div className="fw-semibold">Resenhas</div>
                  <div className="text-muted small">CRUD aninhado por livro.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sobre;
