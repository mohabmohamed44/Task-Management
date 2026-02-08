import { TaskPriority } from "@/domain/enums/task-priority.enum";

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: TaskPriority;
    category: string;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
}