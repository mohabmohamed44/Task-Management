import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/presentation/components/Button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Textarea } from "@/presentation/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { TaskPriority } from "@/domain/enums/task-priority.enum";

interface AddGoalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    category: string;
  }) => void;
  isPending: boolean;
}

export const AddGoalModal = ({
  isOpen,
  onOpenChange,
  onAdd,
  isPending,
}: AddGoalModalProps) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: TaskPriority.Medium,
    category: "",
  });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onAdd(form);
    setForm({
      title: "",
      description: "",
      priority: TaskPriority.Medium,
      category: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
          aria-label="Add new goal"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Add New Goal
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Set a new goal for this week
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="goal-title"
              className="text-gray-700 dark:text-gray-300"
            >
              Goal Title
            </Label>
            <Input
              id="goal-title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter your goal title"
              className="border-gray-300 dark:border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="goal-description"
              className="text-gray-700 dark:text-gray-300"
            >
              Description
            </Label>
            <Textarea
              id="goal-description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe your goal"
              className="border-gray-300 dark:border-gray-700"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="goal-priority"
                className="text-gray-700 dark:text-gray-300"
              >
                Priority
              </Label>
              <Select
                value={form.priority}
                onValueChange={(value: TaskPriority) =>
                  setForm((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger
                  id="goal-priority"
                  className="border-gray-300 dark:border-gray-700"
                >
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
              <Label
                htmlFor="goal-category"
                className="text-gray-700 dark:text-gray-300"
              >
                Category
              </Label>
              <Input
                id="goal-category"
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                placeholder="e.g., Work, Personal"
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
            className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
