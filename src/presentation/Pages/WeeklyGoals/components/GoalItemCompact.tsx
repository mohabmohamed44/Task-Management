import { CheckCircle, Circle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/presentation/components/Button";

interface GoalItemCompactProps {
  goal: any;
  onToggle: (goalId: string, currentStatus: string) => void;
  onDelete: (goalId: string) => void;
  onView: (goal: any) => void;
  onEdit: (goal: any) => void;
}

export const GoalItemCompact = ({ goal, onToggle, onDelete, onView, onEdit }: GoalItemCompactProps) => {
  const isCompleted = goal.status === "completed" || goal.status === "Completed";

  return (
    <div
      className={`flex items-center justify-between p-2 rounded border transition-all ${
        isCompleted
          ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 shrink-0"
          onClick={() => onToggle(goal.id, goal.status)}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted ? (
            <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <Circle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          )}
        </Button>

        <span
          onClick={() => onView(goal)}
          className={`text-sm truncate cursor-pointer ${
            isCompleted
              ? "text-gray-500 dark:text-gray-500 line-through"
              : "text-gray-900 dark:text-gray-100"
          }`}
          title={goal.title}
        >
          {goal.title}
        </span>
      </div>

      <div className="flex items-center gap-0.5 shrink-0 ml-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-gray-600"
          aria-label="Edit goal"
          onClick={() => onEdit(goal)}
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-red-600"
          aria-label="Delete goal"
          onClick={() => onDelete(goal.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
