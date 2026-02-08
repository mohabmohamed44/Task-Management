import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthAPI } from "@/InfraStructure/api/auth.api";
import {
  LoginUser,
  RegisterUser,
  GetCurrentUser,
} from "@/domain/usecases/auth.usecases";
import type { LoginDTO, RegisterDTO } from "@/domain/entities/auth.dto";
import { TokenStorage } from "@/InfraStructure/storage/token.storage";
import toast from "react-hot-toast";

const repo = new AuthAPI();

const loginUser = new LoginUser(repo);
const registerUser = new RegisterUser(repo);
const getCurrentUser = new GetCurrentUser(repo);

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (data: LoginDTO) => loginUser.execute(data),
    onSuccess: (res) => {
      TokenStorage.set(res.token);
      toast.success("Login Successful", {
        position: 'top-center',
        style: {
          backgroundColor: '#333',
          color: '#fff',
          borderRadius: '10px',
        }
      })
    },
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (data: RegisterDTO) => registerUser.execute(data),
    onSuccess: (res) => {
      TokenStorage.set(res.token);
    },
  });

export const useCurrentUserQuery = () => {
  const token = TokenStorage.get();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => getCurrentUser.execute(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};
