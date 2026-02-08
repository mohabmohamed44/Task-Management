import { api } from "@/InfraStructure/api/http";
import type { CreateCommentRequest, UpdateCommentRequest } from "@/domain/entities/comments.dto";
import type { GetCommentsResponse } from "@/domain/entities/comments.response";

export const commentsAPI = {
    create: (taskId: string, data: CreateCommentRequest) => api.post(`/tasks/${Number(taskId)}/comments`, { ...data, task_id: Number(taskId) }),
    get: (taskId: string) => api.get<GetCommentsResponse>(`/tasks/${taskId}/comments`),
    delete: (taskId: string, commentId: string) => api.delete(`/tasks/${taskId}/comments/${commentId}`),
    update: (taskId: string, commentId: string, data: UpdateCommentRequest) => api.put(`/tasks/${taskId}/comments/${commentId}`, data),
};