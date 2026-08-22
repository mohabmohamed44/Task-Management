import axios from "axios";
import { TokenStorage } from "@/InfraStructure/storage/token.storage";
import { API_URL } from "@/lib/constants";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = TokenStorage.get();
  config.headers = config.headers ?? {};
  config.headers.Accept = "application/json";

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete (config.headers as any).Authorization;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // 1. Ignore 401s coming from authentication endpoints
    const isAuthEndpoint =
      requestUrl.includes("/auth/google") ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    if (status === 401 && !isAuthEndpoint) {
      TokenStorage.remove();

      // 2. Prevent redirect loops if the user is already on the login page
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);