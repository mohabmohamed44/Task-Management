import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/Button";
import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Label } from "@/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { TaskPriority } from "@/domain/enums/task-priority.enum";
import { useCreateCardMutation } from "@/app/Queries/kanban.query";
import { X } from "lucide-react";

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  columnId: string;
  columnName: string;
}

export function AddCardDialog({
  open,
  onOpenChange,
  boardId,
  columnId,
  columnName,
}: AddCardDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [labels, setLabels] = useState<string[]>([]);
  const [labelInput, setLabelInput] = useState("");

  const createCardMutation = useCreateCardMutation();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority(TaskPriority.Medium);
    setLabels([]);
    setLabelInput("");
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newLabel = labelInput.trim();
      if (newLabel && !labels.includes(newLabel)) {
        setLabels([...labels, newLabel]);
      }
      setLabelInput("");
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter(l => l !== labelToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    createCardMutation.mutate(
      {
        boardId,
        data: {
          column_id: parseInt(columnId),
          title: title.trim(),
          description: description.trim(),
          priority,
          labels,
        },
      },
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Add Card
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Add a new card to <span className="font-medium">{columnName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="card-title"
              className="text-gray-700 dark:text-gray-300"
            >
              Title
            </Label>
            <Input
              id="card-title"
              placeholder="Enter card title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="card-description"
              className="text-gray-700 dark:text-gray-300"
            >
              Description
            </Label>
            <Textarea
              id="card-description"
              placeholder="Enter card description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-24 resize-none"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Priority</Label>
            <Select
              value={priority}
              onValueChange={(val) => setPriority(val as TaskPriority)}
            >
              <SelectTrigger className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <SelectItem value={TaskPriority.Low}>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Low
                  </span>
                </SelectItem>
                <SelectItem value={TaskPriority.Medium}>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    Medium
                  </span>
                </SelectItem>
                <SelectItem value={TaskPriority.High}>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    High
                  </span>
                </SelectItem>
                <SelectItem value={TaskPriority.Urgent}>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    Urgent
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <Label
              htmlFor="card-labels"
              className="text-gray-700 dark:text-gray-300"
            >
              Labels{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal">
                (optional)
              </span>
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {labels.map((lbl) => (
                <span
                  key={lbl}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  {lbl}
                  <button
                    type="button"
                    onClick={() => removeLabel(lbl)}
                    className="hover:text-red-500 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <Input
              id="card-labels"
              placeholder="Type a label and press Enter..."
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyDown={handleLabelKeyDown}
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createCardMutation.isPending}
              className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
            >
              Add Card
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
