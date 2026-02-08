import { sanitizeEmail, sanitizeText } from "@/lib/sanitization/text";

export interface LoginDTO {
    email:string;
    password: string;
}

export interface RegisterDTO {
    email: string;
    password: string;
    name: string;
}

export class SanitizedLoginDTO implements LoginDTO {
    email: string;
    password: string;

    constructor(data: LoginDTO) {
        this.email = data.email;
        this.password = data.password;
    }
}


export class SanitizedRegisterDTO implements RegisterDTO {
    email: string;
    password: string;
    name: string;

    constructor(data: RegisterDTO) {
        this.email = sanitizeEmail(data.email);
        this.password = data.password;
        this.name = sanitizeText(data.name, {maxLength: 100});
    }
}