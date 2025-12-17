// src/auth/useAuthFetch.jsx
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const useAuthFetch = () => {
  const navigate = useNavigate();

  const authFetch = useCallback(
    async (path, fetchOptions = {}) => {
      // aceita "/livros" e também URL completa
      const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

      const { headers: originalHeaders, ...restOptions } = fetchOptions;

      const headers = new Headers(originalHeaders || {});
      const accessToken = sessionStorage.getItem("at");
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

      // se tiver body e não tiver content-type, seta JSON
      if (restOptions.body && !headers.get("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      const res = await fetch(url, { ...restOptions, headers });

      if (res.status === 401) {
        sessionStorage.removeItem("at");
        sessionStorage.removeItem("user");
        navigate("/usuarios/login", { replace: true });
      }

      return res;
    },
    [navigate]
  );

  return authFetch;
};

export { useAuthFetch };
