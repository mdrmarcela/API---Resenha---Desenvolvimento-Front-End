import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

const useAuthFetch = () => {
  const navigate = useNavigate();

  const authFetch = useCallback(
    async (url, fetchOptions = {}) => {
      const { headers: originalHeaders, body, ...restOptions } = fetchOptions;

      // Se for "/livros/1", vira "http://localhost:3000/livros/1"
      const finalUrl =
        typeof url === "string" && url.startsWith("http")
          ? url
          : `${API_BASE_URL}${url}`;

      const headers = new Headers(originalHeaders || {});

      // Bearer token
      const accessToken = sessionStorage.getItem("at");
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

      // Se o body é string (JSON.stringify), define Content-Type automaticamente (se não veio)
      if (typeof body === "string" && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      const res = await fetch(finalUrl, {
        ...restOptions,
        headers,
        body,
      });

      if (res.status === 401) {
        sessionStorage.removeItem("at");
        navigate("/usuarios/login", { replace: true });
      }

      return res;
    },
    [navigate]
  );

  return authFetch;
};

export { useAuthFetch };
