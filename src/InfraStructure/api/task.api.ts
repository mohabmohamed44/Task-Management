import {api} from "@/InfraStructure/api/http";
import type { CreateTaskDTO } from "@/domain/entities/task.dto";
import type { GetTaskQueryDTO } from "@/domain/entities/get-tasks-query.dto";
import type { PaginatedTasksApiResponse } from "@/domain/entities/task-api.response";
import type { UserStats } from "@/domain/entities/stats";
import type { getTaskHistory } from "@/domain/entities/task.entity";

export const TaskAPI = {
    createTask: (data: CreateTaskDTO) => api.post("/tasks", data),

    getTasks: (params: GetTaskQueryDTO) => api.get<PaginatedTasksApiResponse>("/tasks", {
        params,
    }),

    getTaskById: (id: string) => api.get(`/tasks/${id}`),

    updateTask: (id: string, data: Partial<CreateTaskDTO>) => api.put(`/tasks/${id}`, data),

    deleteTask: (id: string) => api.delete(`/tasks/${id}`),

    getStats: () => api.get<UserStats>("/tasks/stats"),

    getTaskHistory: (id: string) => api.get<getTaskHistory[]>(`/tasks/${id}/history`)
};