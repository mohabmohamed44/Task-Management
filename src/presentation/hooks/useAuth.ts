import { useState, useEffect, useCallback } from "react";
import type { User, LoginResponse } from "@/domain/entities/user";
import type { LoginDTO, RegisterDTO } from "@/domain/entities/auth.dto";
import { LoginUser, RegisterUser, GetCurrentUser } from "@/domain/usecases/auth.usecases";
import { AuthAPI } from "@/InfraStructure/api/auth.api";
import { TokenStorage } from "@/InfraStructure/storage/token.storage";
import toast from "react-hot-toast";

// Initialize use cases
const authAPI = new AuthAPI();
const loginUser = new LoginUser(authAPI);
const registerUser = new RegisterUser(authAPI);
const getCurrentUser = new GetCurrentUser(authAPI);

let authFetchPromise: Promise<User | LoginResponse> | null = null;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => !!TokenStorage.get());

  // Load user on mount if token exists
  useEffect(() => {
    const token = TokenStorage.get();
    if (!token) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    if (!authFetchPromise) {
      authFetchPromise = getCurrentUser.execute(token)
        .catch((err) => {
          authFetchPromise = null;
          throw err;
        });
    }

    authFetchPromise
      .then((data) => {
        if (data && typeof data === 'object' && 'user' in data) {
          const loginResponse = data as unknown as LoginResponse;
          if (loginResponse.user) {
            setUser(loginResponse.user as User);
          }
        } else {
          const userData = data as User;
          if (userData?.id) {
            setUser(userData);
          }
        }
      })
      .catch((err: any) => {
        const status = err?.response?.status;
        if (status === 401 || !TokenStorage.get()) {
          TokenStorage.remove();
          setUser(null);
        }
      })
      .finally(() => {
        setLoading(false);
        authFetchPromise = null;
      });
  }, []);

  // Login
  const login = useCallback(async (payload: LoginDTO) => {
    try {
      const data: LoginResponse = await loginUser.execute(payload);

      if (data.token) {
        TokenStorage.set(data.token);
        setUser(data.user);
        toast.success("Login successful!");
      }

      return data;
    } catch (error: unknown) {
      const errorMessage = 
        error && typeof error === 'object' && 'message' in error
          ? (error as Error).message
          : "Login failed. Please try again.";
      
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Register
  const register = useCallback(async (payload: RegisterDTO) => {
    try {
      const data: LoginResponse = await registerUser.execute(payload);

      if (data.token) {
        TokenStorage.set(data.token);
        setUser(data.user);
        toast.success("Registration successful!");
      }

      return data;
    } catch (error: unknown) {
      const errorMessage = 
        error && typeof error === 'object' && 'message' in error
          ? (error as Error).message
          : "Registration failed. Please try again.";
      
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    TokenStorage.remove();
    setUser(null);
    window.location.href = "/auth/login";
  }, []);

  return {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};