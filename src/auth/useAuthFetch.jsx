// src/auth/useAuthFetch.jsx
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useAuthFetch = () => {
  const navigate = useNavigate();

  const authFetch = useCallback(async (url, fetchOptions = {}) => {
    const { headers: originalHeaders, ...restOptions } = fetchOptions;

    const headers = new Headers(originalHeaders || {});
    const accessToken = sessionStorage.getItem("at");
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    const res = await fetch(url, { ...restOptions, headers });

    if (res.status === 401) {
      sessionStorage.removeItem("at");
      navigate("/login", { replace: true }); // ajuste se sua rota for outra
    }

    return res;
  }, [navigate]);

  return authFetch;
};

export { useAuthFetch };
