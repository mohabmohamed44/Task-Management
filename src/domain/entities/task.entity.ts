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

export interface getTaskHistory {
  id: number;
  task_id: number;
  user_id: number;
  action: string;
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  users: {
    name: string;
    email: string;
  };
  userName: string;
  userEmail: string;
}