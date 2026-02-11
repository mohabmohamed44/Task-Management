export interface User {
    id: number | string;
    name: string;
    email: string;
    profile_image_url?: string;
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