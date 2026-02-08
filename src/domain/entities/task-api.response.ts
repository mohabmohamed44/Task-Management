import type { TaskPriority } from "@/domain/enums/task-priority.enum";

export interface TaskApiResponse {
    id: number;
    userId: number;
    title: string;
    description: string;
    completed: boolean;
    priority: TaskPriority;
    category: string;
    due_date: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    created_at: string;
    updated_at: string;
    tags: string[];
}

export interface PaginatedTasksApiResponse {
    data: TaskApiResponse[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
} 