// src/auth/AuthContext.jsx
import { createContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";

const STORE = sessionStorage;       // ou localStorage
const TOKEN_KEY = "at";
const USER_KEY = "user";

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
  const [token, setToken] = useState(() => STORE.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = STORE.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);

  const isAuth = useMemo(() => !!token, [token]);

  function persistAuth({ token: t, user: u }) {
    if (t) STORE.setItem(TOKEN_KEY, t);
    else STORE.removeItem(TOKEN_KEY);

    if (u) STORE.setItem(USER_KEY, JSON.stringify(u));
    else STORE.removeItem(USER_KEY);

    setToken(t || null);
    setUser(u || null);
  }

  function logout() {
    sessionStorage.removeItem("at");
    setToken(null);
    setUser(null);
}

  // Boot: valida expiração do token e mantém user do storage
  useEffect(() => {
    try {
      const storedToken = STORE.getItem(TOKEN_KEY);
      if (!storedToken) {
        logout();
        return;
      }

      const decoded = jwtDecode(storedToken);
      if (decoded?.exp && decoded.exp * 1000 <= Date.now()) {
        logout();
        return;
      }

      // token ok: mantém token e user (se existir) do storage
      setToken(storedToken);
      const rawUser = STORE.getItem(USER_KEY);
      setUser(rawUser ? JSON.parse(rawUser) : { id: decoded.id, nome: decoded.nome, email: decoded.email });
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
    if (!res.ok) throw new Error(data?.erro || "Erro ao realizar login");

    // { usuario, token }
    persistAuth({ token: data.token, user: data.usuario });
  }

  async function register({ nome, email, senha }) {
    const res = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.erro || "Erro ao cadastrar");

    await login(email, senha); // registrar → autenticar
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, isAuth, authLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
