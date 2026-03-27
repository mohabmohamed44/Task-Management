import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/Button";
import { Badge } from "@/presentation/components/ui/badge";
import { getPriorityColor } from "@/domain/utils/task-ui";
import { format } from "date-fns";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: any | null;
};

export function GoalDetailsModal({ open, onOpenChange, goal }: Props) {
  if (!goal) return null;

  const createdAt = goal.created_at ? new Date(goal.created_at) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Goal Details
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            View goal information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Title</div>
            <div className="text-base font-medium text-gray-900 dark:text-gray-100">
              {goal.title}
            </div>
          </div>

          {goal.description ? (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Description</div>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                {goal.description}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {goal.priority ? <Badge aria-label="Priority badge" className={`text-xs ${getPriorityColor(goal.priority)}`}>{goal.priority}</Badge> : null}
            {goal.category ? <Badge aria-label="Goal Category" variant="outline" className="text-xs">{goal.category}</Badge> : null}
            {goal.status ? <Badge variant="outline" className="text-xs">{goal.status}</Badge> : null}
            {typeof goal.progress === "number" ? (
              <Badge variant="outline" className="text-xs">{goal.progress}%</Badge>
            ) : null}
          </div>

          {createdAt ? (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Created: {format(createdAt, "PPP p")}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}