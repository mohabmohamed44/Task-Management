export interface User {
    id: number | string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    created_at ? : string;
    updated_at?: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: {
        id: number;
        name: string;
        email:string;
    };
}