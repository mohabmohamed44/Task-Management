import { useState } from "react";
import { Circle, CheckCircle, Edit, Trash2 } from "lucide-react";
import { Input } from "@/presentation/components/ui/input";
import { Button } from "@/presentation/components/Button";
import { isMilestoneCompleted } from "../utils/milestoneStats";

interface GoalMilestoneCardProps {
  goal: any;
  isAdding: boolean;
  onToggle: (goalId: string, milestone: any) => void;
  onEdit: (goalId: string, milestone: any) => void;
  onDelete: (goalId: string, milestoneId: string) => void;
  onAdd: (goalId: string, title: string) => void;
}

export function GoalMilestoneCard({
  goal,
  isAdding,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
}: GoalMilestoneCardProps) {
  const milestones = Array.isArray(goal?.milestones) ? goal.milestones : [];
  const completedCount = milestones.filter(isMilestoneCompleted).length;
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(String(goal.id), trimmed);
    setTitle("");
  };

  return (
    <div className="flex flex-col border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
      {/* Goal header */}
      <div className="flex items-start justify-between gap-3 border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="min-w-0">
          <h3 className="font-montserrat text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
            {goal.title}
          </h3>
          <p className="mt-1 font-inter text-xs text-gray-500 dark:text-gray-400">
            {goal.category || "General"} &middot; {milestones.length} milestone{milestones.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span className="shrink-0 rounded border border-gray-200 dark:border-gray-700 px-3 py-1 font-montserrat text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          {progress}%
        </span>
      </div>

      {/* Milestone list */}
      <ul className="flex-1 divide-y divide-gray-100 dark:divide-gray-800">
        {milestones.map((milestone: any) => {
          const isCompleted = isMilestoneCompleted(milestone);
          return (
            <li key={milestone.id} className="group flex items-center gap-3 px-4 py-2.5">
              <button
                type="button"
                onClick={() => onToggle(String(goal.id), milestone)}
                aria-label={isCompleted ? "Mark milestone incomplete" : "Mark milestone complete"}
                className={isCompleted
                  ? "shrink-0 text-gray-500 dark:text-gray-400"
                  : "shrink-0 text-gray-400 transition-colors hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"}
              >
                {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </button>

              <span
                className={
                  isCompleted
                    ? "min-w-0 flex-1 truncate font-inter text-sm text-gray-400 line-through dark:text-gray-500"
                    : "min-w-0 flex-1 truncate font-inter text-sm text-gray-800 dark:text-gray-200"
                }
              >
                {milestone.title}
              </span>

              <div className="flex shrink-0 items-center gap-0.5 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onEdit(String(goal.id), milestone)}
                  aria-label="Edit milestone"
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(String(goal.id), String(milestone.id))}
                  aria-label="Delete milestone"
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          );
        })}

        {milestones.length === 0 && (
          <li className="px-4 py-8 text-center">
            <p className="font-inter text-sm text-gray-400 dark:text-gray-500">No milestones yet</p>
            <p className="mt-1 font-inter text-xs text-gray-300 dark:text-gray-600">Add the first milestone below</p>
          </li>
        )}
      </ul>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 dark:bg-gray-800" aria-hidden="true">
        <div
          className="h-full bg-gray-900 transition-all duration-300 dark:bg-gray-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Add milestone */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-800 p-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a milestone"
          aria-label={`Add milestone to ${goal.title}`}
          className="h-8 rounded border-gray-300 font-inter text-sm focus-visible:border-black dark:border-gray-700 dark:focus-visible:border-white"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isAdding || !title.trim()}
          className="h-8 shrink-0 rounded bg-gray-900 font-montserrat text-[11px] font-bold uppercase tracking-widest text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {isAdding ? "Adding" : "Add"}
        </Button>
      </form>
    </div>
  );
}
