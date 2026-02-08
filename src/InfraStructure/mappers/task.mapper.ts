import type { TaskApiResponse } from "@/domain/entities/task-api.response";
import type { Task } from "@/domain/entities/task.entity";

export const mapTaskFromApi = (task: TaskApiResponse): Task => ({
  id: task.id,
  title: task.title,
  description: task.description,
  completed: task.completed,
  priority: task.priority,
  category: task.category,
  dueDate: task.due_date ? new Date(task.due_date) : null,
  tags: task.tags || [],
  createdAt: new Date(task.created_at),
  updatedAt: new Date(task.updated_at),
});
