import { AuthAPI } from "@/InfraStructure/api/auth.api";
import { type LoginDTO, type RegisterDTO } from "@/domain/entities/auth.dto";
import { type LoginResponse, type User } from "@/domain/entities/user";

export class LoginUser {
    private repo: AuthAPI;

    constructor(repo: AuthAPI) {
        this.repo = repo;
    }
    async execute(data: LoginDTO): Promise<LoginResponse> {
        return await this.repo.login(data);
    }
}

export class RegisterUser {
    private repo: AuthAPI;

    constructor(repo: AuthAPI) {
        this.repo = repo;
    }

    async execute(data: RegisterDTO) : Promise<LoginResponse> {
        return await this.repo.register(data);
    }

}

export class GetCurrentUser {
    constructor (private repo: AuthAPI){};
    execute(token:string) : Promise<User> {
        return this.repo.getCurrentUser(token);
    }
}

export class UpdateProfilePicture {
    constructor(private repo: AuthAPI) {}

    async execute(token: string, file: File): Promise<{ message: string; data: { imageUrl: string } }> {
        return await this.repo.updateProfilePicture(token, file);
    }
}