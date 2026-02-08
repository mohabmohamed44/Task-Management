import type {TaskPriority} from "@/domain/enums/task-priority.enum";

export type SortOrder = "asc" | "desc";

export interface GetTaskQueryDTO {
    page?:number;
    limit?: number;
    sort?: "createdAt" | "updatedAt" | "dueDate";
    order?: SortOrder;
    priority?: TaskPriority;
    category?: string;
    completed?: boolean;
}