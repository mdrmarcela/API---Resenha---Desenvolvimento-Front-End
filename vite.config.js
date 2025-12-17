// vite.config.js
// -----------------------------------------------------------------------------
// OBJETIVO DESTE ARQUIVO
// -----------------------------------------------------------------------------
// Este arquivo configura o Vite, que é a ferramenta usada para rodar o projeto
// React em modo desenvolvimento e também para gerar o build de produção.
//
// Aqui fazemos três coisas principais:
// 1) Dizemos ao Vite que vamos usar React (plugin @vitejs/plugin-react-swc);
// 2) Definimos uma Content Security Policy (CSP) mais rígida para produção;
// 3) Aplicamos essa CSP apenas no `preview` (simulação de produção), e NÃO em dev,
//    para não quebrar o hot reload e os scripts internos do Vite.
// -----------------------------------------------------------------------------

// `defineConfig` é uma função auxiliar do Vite que ajuda a escrever
// a configuração com melhor suporte de tipos/autocomplete.
import { defineConfig } from "vite";

// Plugin oficial do Vite para projetos React usando o compilador SWC.
// Ele é responsável por entender JSX/TSX, fazer transformações, HMR etc.
import react from "@vitejs/plugin-react-swc";

// -----------------------------------------------------------------------------
// DEFINIÇÃO DA CONTENT SECURITY POLICY (CSP) PARA PRODUÇÃO/PREVIEW
// -----------------------------------------------------------------------------
// A CSP é um cabeçalho de segurança que diz ao navegador de quais origens
// (domínios / protocolos) o site pode carregar scripts, estilos, imagens, etc.
// Isso ajuda a reduzir o risco de ataques como XSS (injeção de scripts).
const csp = [
  "default-src 'none'",

  // Libera ReCAPTCHA scripts (google + gstatic)
  "script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
  // Alguns browsers distinguem script-src-elem
  "script-src-elem 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",

  "style-src 'self'",
  // ReCAPTCHA carrega assets como imagens em gstatic/google
  "img-src 'self' data: https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ http://localhost:3000 https://node-chamados-backend-2025.onrender.com",
  "font-src 'self'",

  // ReCAPTCHA faz requests XHR/fetch pra google/gstatic
  "connect-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ http://localhost:3000 https://node-chamados-backend-2025.onrender.com",
  
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "object-src 'none'",

  // Iframes do ReCAPTCHA
  "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
  // Se quiser ser extra seguro, pode manter child-src junto:
  "child-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",

  "upgrade-insecure-requests",
].join("; ");

// -----------------------------------------------------------------------------
// EXPORTANDO A CONFIGURAÇÃO PARA O VITE
// -----------------------------------------------------------------------------
// `defineConfig` recebe um objeto com as opções do Vite e exporta como padrão.
// O Vite lê esse arquivo automaticamente quando você roda `npm run dev` ou `npm run build`.
export default defineConfig({
    // Nome do repositório no github
    base: "/react-frontend-chamados-2025/",
    // Plugins que o Vite deve usar; aqui só estamos usando o plugin do React.
    plugins: [react()],

    // ---------------------------------------------------------------------------
    // CONFIGURAÇÃO DO SERVIDOR DE DESENVOLVIMENTO (npm run dev)
    // ---------------------------------------------------------------------------
    server: {
        headers: {
            // Aqui poderíamos definir cabeçalhos extras para o servidor de DEV.
            // De propósito NÃO colocamos a CSP em desenvolvimento.
            //
            // Motivo:
            // - Em dev, o Vite injeta scripts especiais (HMR, React Fast Refresh, etc.)
            //   que usam scripts inline e outras coisas que uma CSP rígida bloquearia.
            // - Se colocarmos uma CSP muito restritiva aqui, o hot reload quebra e
            //   o ambiente de desenvolvimento fica cheio de erros de CSP.
            //
            // Por isso, deixamos SEM "Content-Security-Policy" no dev.
            // Quando você acessar via `npm run dev`, não terá essa CSP ativa.
        },
    },

    // ---------------------------------------------------------------------------
    // CONFIGURAÇÃO DO `vite preview` (build local de produção)
    // ---------------------------------------------------------------------------
    // `vite preview` simula o comportamento do build de produção rodando em um
    // servidor estático local. Aqui já faz sentido aplicar a CSP rígida para
    // testar a segurança antes de subir para o servidor real.
    preview: {
        headers: {
            // Agora sim, aplicamos a Content Security Policy definida acima.
            "Content-Security-Policy": csp,
        },
    },
});
