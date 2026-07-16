import { Calendar, Flag, Tag } from "lucide-react";
import type { Task } from "@/domain/entities/task.entity";
import { TaskPriority } from "@/domain/enums/task-priority.enum";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onClick?: () => void;
}

function getPriorityClass(priority: TaskPriority) {
  switch (priority) {
    case TaskPriority.Urgent:
      return "bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-100 border-gray-200 dark:border-gray-700";
    case TaskPriority.High:
      return "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700";
    case TaskPriority.Medium:
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    case TaskPriority.Low:
      return "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700";
  }
}

export function TaskCard({ task, isOverlay = false, onClick }: TaskCardProps) {

  return (
    <div
      onClick={onClick}
      className={`
        border bg-white dark:bg-gray-950
        ${isOverlay
          ? 'scale-[1.02] ring-2 ring-black dark:ring-white cursor-grabbing border-gray-200 dark:border-gray-700'
          : 'border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-gray-100 cursor-pointer'
        }
      `}
      style={{ cursor: isOverlay ? 'grabbing' : 'pointer' }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <span
              className={`text-sm font-semibold text-black dark:text-gray-100 font-['Montserrat'] truncate ${
                task.completed ? "line-through text-gray-400 dark:text-gray-600" : ""
              }`}
            >
              {task.title}
            </span>
            {task.description && (
              <p className="text-xs text-gray-500 dark:text-gray-500 font-['Inter'] line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-[0.02em] font-bold font-['Montserrat'] border rounded ${getPriorityClass(task.priority)}`}
            aria-label={`Priority: ${task.priority}`}
          >
            <Flag className="h-3 w-3" />
            {task.priority}
          </span>

          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-[0.02em] font-bold font-['Montserrat'] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded"
            aria-label={`Category: ${task.category}`}
          >
            <Tag className="h-3 w-3" />
            {task.category}
          </span>

          <div
            className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-500 font-['Inter']"
            aria-label={`Due date: ${task.dueDate}`}
          >
            <Calendar className="h-3 w-3" />
            {task.dueDate ? task.dueDate.toLocaleDateString() : "No date"}
          </div>
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-[0.02em] font-bold font-['Montserrat'] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
