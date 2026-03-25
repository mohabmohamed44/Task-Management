import { Target } from "lucide-react";
import { GoalItem } from "./GoalItem";

interface GoalListProps {
  goals: any[];
  onToggle: (goalId: string, currentStatus: string) => void;
  onDelete: (goalId: string) => void;
}

export const GoalList = ({ goals, onToggle, onDelete }: GoalListProps) => {
  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-500">
        <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No goals found</p>
        <p className="text-sm mt-1">Add a new goal to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((goal) => (
        <GoalItem
          key={goal.id}
          goal={goal}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
