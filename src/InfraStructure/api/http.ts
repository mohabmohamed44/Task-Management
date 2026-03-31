import axios from "axios";
import {TokenStorage} from "@/InfraStructure/storage/token.storage";
import { API_URL } from "@/lib/constants";


export const api = axios.create({
    baseURL: API_URL,
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
})

// response interceptors (optional global error handling)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            TokenStorage.remove();
            const safeRedirect = (path: string) => {
              const allowedPaths = ['/auth/login', '/auth/register', '/'];
              if (allowedPaths.includes(path)) window.location.href = path;
            };
            safeRedirect("/auth/login");
        }
        return Promise.reject(error);
    }
)