import type { User } from "./user";
import { sanitizeComment } from "@/lib/sanitization/html";
export interface Comment {
    id: number;
    task_id: number;
    user_id: number;
    text: string;
    created_at: Date;
    user: User;
    userName: string;
    userEmail: string;
}

export interface CreateCommentRequest {
    text: string;
    task_id?: number;
}

export interface UpdateCommentRequest {
    text: string;
}

export interface DeleteCommentRequest {
    id: number;
}

export class SantizedCreateCommentRequest implements CreateCommentRequest {
    text: string;

    constructor(data: CreateCommentRequest) {
        this.text = sanitizeComment(data.text);
    }
}
