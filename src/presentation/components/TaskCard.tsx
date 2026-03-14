import { Calendar, Flag, Tag } from "lucide-react";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import type { Task } from "@/domain/entities/task.entity";
import {getPriorityColor} from "@/domain/utils/task-ui";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export function TaskCard({ task, isOverlay = false }: TaskCardProps) {

  return (
    <Card
      className={`
        border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900
        ${isOverlay ? 'shadow-2xl scale-105 ring-2 ring-blue-500 cursor-grabbing' : 'hover:shadow-md transition-shadow'}
      `}
      style={{ cursor: isOverlay ? 'grabbing' : 'grab' }}
    >
      <CardContent className="p-4">
        {/* Task Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1">
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {task.completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </Button> */}
            <span
              className={`text-sm font-medium text-gray-800 dark:text-gray-200 ${
                task.completed ? "line-through text-gray-500 dark:text-gray-500" : ""
              }`}
            >
              {task.title}
            </span>
          </div>
        </div>

        {/* Task Meta */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {/* Priority Badge */}
          <Badge
            className={`text-xs ${getPriorityColor(task.priority)}`}
            aria-label={`Priority: ${task.priority}`}
          >
            <Flag className="h-3 w-3 mr-1" />
            {task.priority}
          </Badge>

          {/* Category */}
          <Badge
            variant="outline"
            className="text-xs border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            aria-label={`Category: ${task.category}`}
          >
            <Tag className="h-3 w-3 mr-1" />
            {task.category}
          </Badge>

          {/* Due Date */}
          <div
            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500"
            aria-label={`Due date: ${task.dueDate}`}
          >
            <Calendar className="h-3 w-3" />
            {task.dueDate ? task.dueDate.toLocaleDateString() : "No date"}
          </div>
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
