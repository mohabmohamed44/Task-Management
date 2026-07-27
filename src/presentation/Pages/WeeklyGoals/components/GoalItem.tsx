import { Flag, Edit, Trash2, CheckCircle, Circle, Layers } from "lucide-react";
import { Button } from "@/presentation/components/Button";
import { Badge } from "@/presentation/components/ui/badge";
import { getPriorityColor } from "@/domain/utils/task-ui";

interface GoalItemProps {
  goal: any;
  onToggle: (goalId: string, currentStatus: string) => void;
  onDelete: (goalId: string) => void;
  onView: (goal: any) => void;
  onEdit: (goal: any) => void;
}

export const GoalItem = ({ goal, onToggle, onDelete, onView, onEdit }: GoalItemProps) => {
  const isCompleted = goal.status === "completed" || goal.status === "Completed";

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
        isCompleted
          ? "bg-muted/40 border-border/60"
          : "bg-card border-border/60 hover:border-primary/30 hover:shadow-sm"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 p-0 mt-0.5 shrink-0"
        onClick={() => onToggle(goal.id, goal.status)}
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
      >
        {isCompleted ? (
          <CheckCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4
              onClick={() => onView(goal)}
              className={`font-medium cursor-pointer ${
                isCompleted
                  ? "text-gray-500 dark:text-gray-500 line-through"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {goal.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
              {goal.description}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Edit goal"
              onClick={() => onEdit(goal)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              aria-label="Delete goal"
              onClick={() => onDelete(goal.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge
            className={`text-xs ${getPriorityColor(goal.priority)}`}
            aria-label={`Priority: ${goal.priority}`}
          >
            <Flag className="h-3 w-3 mr-1" />
            {goal.priority}
          </Badge>
          {isCompleted && (
            <Badge
              variant="outline"
              className="text-xs border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            >
              Completed
            </Badge>
          )}
          <Badge 
            className="text-xs md:text-md"
            aria-label={`Goal Category ${goal.category}`}
          >
            {goal.category}
            <Layers className="h-3 w-3"/>
          </Badge>
        </div>
      </div>
    </div>
  );
};
