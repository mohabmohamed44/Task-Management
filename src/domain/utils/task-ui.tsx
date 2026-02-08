import { TaskPriority } from "@/domain/enums/task-priority.enum";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
export function getPriorityColor(priority: TaskPriority) {
  switch (priority) {
    case TaskPriority.Urgent:
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    case TaskPriority.High:
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
    case TaskPriority.Medium:
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
    case TaskPriority.Low:
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
  }
}

export function getPriorityIconName(priority: TaskPriority) {
  switch (priority) {
    case TaskPriority.Urgent:
    case TaskPriority.High:
      return <AlertCircle className="h-4 w-4" />;
    case TaskPriority.Medium:
      return <Clock className="h-4 w-4" />;
    case TaskPriority.Low:
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}
