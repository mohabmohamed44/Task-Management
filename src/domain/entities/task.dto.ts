import type { TaskPriority } from "@/domain/enums/task-priority.enum";
import { sanitizeTaskDescription, sanitizeTaskTitle, sanitizeText } from "@/lib/sanitization/text";

export interface CreateTaskDTO {
    title: string;
    description: string;
    priority: TaskPriority;
    category: string;
    dueDate?: string;
    tags: string[];
}

export type UpdateTaskDTO = Partial<CreateTaskDTO> & {
    completed?: boolean;
}
export class SanitizedCreateTaskDTO implements CreateTaskDTO {
    title: string;
    description: string;
    priority: TaskPriority;
    category: string;
    tags: string[];
    dueDate?: string | undefined;

    constructor(data: CreateTaskDTO) {
        this.title = sanitizeTaskTitle(data.title);
        this.description = sanitizeTaskDescription(data.description);
        this.priority = data.priority;
        this.category = sanitizeText(data.category, {maxLength: 50});
        this.dueDate = data.dueDate;
        this.tags = data.tags;
    }
}