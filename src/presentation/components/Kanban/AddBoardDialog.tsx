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
import { useCreateBoardMutation } from "@/app/Queries/kanban.query";

interface AddBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBoardDialog({ open, onOpenChange }: AddBoardDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createBoardMutation = useCreateBoardMutation();

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    createBoardMutation.mutate(
      {
        name: name.trim(),
        description: description.trim(),
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
            Create New Board
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Create a new Kanban board to organize your tasks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="board-name"
              className="text-gray-700 dark:text-gray-300"
            >
              Board Name
            </Label>
            <Input
              id="board-name"
              placeholder="Enter board name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="board-description"
              className="text-gray-700 dark:text-gray-300"
            >
              Description{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="board-description"
              placeholder="Enter board description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-20 resize-none"
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
              loading={createBoardMutation.isPending}
              className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
            >
              Create Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
