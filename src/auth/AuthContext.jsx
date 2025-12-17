// src/auth/AuthContext.jsx
import { createContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Aceita qualquer um dos nomes, pra não quebrar seu .env atual:
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";

// Troque pra localStorage se quiser manter logado ao fechar o navegador
const TOKEN_STORE = sessionStorage; // ou localStorage
const TOKEN_KEY = "at"; // mantendo o mesmo nome que você já usa

const AuthContext = createContext({
  user: null,
  token: null,
  isAuth: false,
  authLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => TOKEN_STORE.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const isAuth = useMemo(() => !!token, [token]);

  function saveToken(t) {
    if (t) TOKEN_STORE.setItem(TOKEN_KEY, t);
    else TOKEN_STORE.removeItem(TOKEN_KEY);
    setToken(t || null);
  }

  function logout() {
    saveToken(null);
    setUser(null);
  }

  // Boot: tenta reaproveitar token salvo e validar expiração
  useEffect(() => {
    try {
      const stored = TOKEN_STORE.getItem(TOKEN_KEY);
      if (!stored) {
        setUser(null);
        return;
      }

      const decoded = jwtDecode(stored);

      // Se tiver exp e estiver expirado, desloga
      if (decoded?.exp && decoded.exp * 1000 <= Date.now()) {
        logout();
        return;
      }

      // Seu JWT tem: { id, email, nome }
      setUser({ id: decoded.id, email: decoded.email, nome: decoded.nome });
      setToken(stored);
    } catch {
      logout();
    } finally {
      setAuthLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, senha) {
    const res = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.erro || "Erro ao realizar login");
    }

    // seu back retorna { usuario, token }
    saveToken(data.token);
    setUser(data.usuario);
  }

  async function register({ nome, email, senha }) {
    const res = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.erro || "Erro ao cadastrar");
    }

    // Fluxo mínimo do enunciado: registrar → autenticar
    await login(email, senha);
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, isAuth, authLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
