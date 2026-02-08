import { AuthAPI } from "@/InfraStructure/api/auth.api";
import { LoginUser, RegisterUser } from "@/domain/usecases/auth.usecases";
import { type LoginDTO, type RegisterDTO } from "@/domain/entities/auth.dto";

const authRepo = new AuthAPI();
const loginUseCase = new LoginUser(authRepo);
const registerUser = new RegisterUser(authRepo);

export const useAuth = () => {
  const login = async (data: LoginDTO) => {
    return await loginUseCase.execute(data);
  };

  const register = async (data: RegisterDTO) => {
    return await registerUser.execute(data);
  };

  return { login, register };
};
