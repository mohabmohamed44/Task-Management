import type { Comment } from "./comments.dto";

export type GetCommentsResponse = Comment[];

export interface CreateCommentResponse {
    success: boolean;
    comment: Comment;
    message: string;
}

export interface UpdateCommentResponse {
    success: boolean;
    comment: Comment;
    message: string;
}

export interface DeleteCommentResponse {
    success: boolean;
    message: string;
}