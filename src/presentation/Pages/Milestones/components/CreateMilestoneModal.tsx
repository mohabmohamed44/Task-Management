import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/Button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";

interface CreateMilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goals: { id: string; title: string }[];
  onSubmit: (goalId: string, title: string) => void;
  isPending?: boolean;
}

export function CreateMilestoneModal({
  open,
  onOpenChange,
  goals,
  onSubmit,
  isPending,
}: CreateMilestoneModalProps) {
  const [title, setTitle] = useState("");
  const [goalId, setGoalId] = useState<string>(goals[0]?.id ?? "");
  const [prevOpen, setPrevOpen] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setTitle("");
      setGoalId(goals[0]?.id ?? "");
    }
  }

  const handleCreate = () => {
    if (!title.trim() || !goalId) return;
    onSubmit(goalId, title.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="font-montserrat text-gray-900 dark:text-white">
            Create Milestone
          </DialogTitle>
          <DialogDescription className="font-inter text-gray-600 dark:text-gray-400">
            Add a new milestone to one of your weekly goals
          </DialogDescription>
        </DialogHeader>

        {goals.length === 0 ? (
          <p className="py-6 text-center font-inter text-sm text-gray-500 dark:text-gray-400">
            No goals available this week. Create a goal first.
          </p>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="create-milestone-title" className="font-inter text-sm font-medium text-gray-700 dark:text-gray-300">
                Milestone Title
              </Label>
              <Input
                id="create-milestone-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete API integration"
                className="rounded border-gray-300 font-inter focus-visible:border-black dark:border-gray-700 dark:focus-visible:border-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-inter text-sm font-medium text-gray-700 dark:text-gray-300">
                Goal
              </Label>
              <Select value={goalId} onValueChange={setGoalId}>
                <SelectTrigger className="rounded border-gray-300 font-inter dark:border-gray-700">
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent className="bg-white font-inter dark:bg-gray-900">
                  {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded border-gray-300 font-montserrat text-[11px] font-bold uppercase tracking-widest text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            disabled={!!isPending || !title.trim() || !goalId || goals.length === 0}
            className="rounded bg-gray-900 font-montserrat text-[11px] font-bold uppercase tracking-widest text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
