import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/Button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";
import { TaskPriority } from "@/domain/enums/task-priority.enum";

type EditPayload = {
  title: string;
  description: string;
  priority: TaskPriority;
  category: string;
  status: string;
  progress: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: any | null;
  onSubmit: (goalId: string, data: Partial<EditPayload>) => void;
  isPending?: boolean;
};

function getGoalStatus(goal: any): string {
  // keep whatever backend already uses if present
  if (typeof goal?.status === "string" && goal.status.trim()) return goal.status;
  // fallback from boolean
  if (goal?.completed === true) return "Completed";
  return "Pending";
}

function getGoalProgress(goal: any): number {
  if (typeof goal?.progress === "number") return goal.progress;
  return goal?.completed === true ? 100 : 0;
}

export function EditGoalModal({ open, onOpenChange, goal, onSubmit, isPending }: Props) {
  const goalId = goal?.id ? String(goal.id) : null;

  const initialForm = useMemo<EditPayload>(() => {
    return {
      title: goal?.title ?? "",
      description: goal?.description ?? "",
      priority: (goal?.priority as TaskPriority) ?? TaskPriority.Medium,
      category: goal?.category ?? "",
      status: getGoalStatus(goal),
      progress: getGoalProgress(goal),
    };
  }, [goal]);

  const [prevGoalId, setPrevGoalId] = useState<string | null>(null);
  const [form, setForm] = useState<EditPayload>(initialForm);

  // Reset form when a different goal is selected or modal opens
  if (goalId !== prevGoalId) {
    setPrevGoalId(goalId);
    setForm(initialForm);
  }

  if (!goal || !goalId) return null;

  const handleSave = () => {
    if (!form.title.trim()) return;

    onSubmit(goalId, {
      title: form.title,
      description: form.description,
      priority: form.priority,
      category: form.category || "General",
      status: form.status,
      progress: form.progress,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Edit Goal
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Update goal information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-goal-title" className="text-gray-700 dark:text-gray-300">
              Goal Title
            </Label>
            <Input
              id="edit-goal-title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="border-gray-300 dark:border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-goal-description" className="text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="edit-goal-description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="border-gray-300 dark:border-gray-700"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v: TaskPriority) => setForm((p) => ({ ...p, priority: v }))}
              >
                <SelectTrigger className="border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900">
                  <SelectItem value={TaskPriority.Low}>Low</SelectItem>
                  <SelectItem value={TaskPriority.Medium}>Medium</SelectItem>
                  <SelectItem value={TaskPriority.High}>High</SelectItem>
                  <SelectItem value={TaskPriority.Urgent}>Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="border-gray-300 dark:border-gray-700"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={!!isPending}
            className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}