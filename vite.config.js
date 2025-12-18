import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const csp = [
  "default-src 'none'",

  "script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",

  "script-src-elem 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",

  "style-src 'self'",

  "img-src 'self' data: https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ http://localhost:3000 https://node-chamados-backend-2025.onrender.com",
  "font-src 'self'",


  "connect-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ http://localhost:3000 https://node-chamados-backend-2025.onrender.com",
  
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "object-src 'none'",


  "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",

  "child-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",

  "upgrade-insecure-requests",
].join("; ");


export default defineConfig({

    base: "API---Resenha---Desenvolvimento-Front-End",
    plugins: [react()],
    server: {
        headers: {
        },
    },

    preview: {
        headers: {

            "Content-Security-Policy": csp,
        },
    },
});