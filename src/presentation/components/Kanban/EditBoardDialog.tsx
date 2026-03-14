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
import { Label } from "@/presentation/components/ui/label";
import { useUpdateBoardMutation } from "@/app/Queries/kanban.query";

interface EditBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  currentName: string;
  currentDescription: string;
}

export function EditBoardDialog({
  open,
  onOpenChange,
  boardId,
  currentName,
  currentDescription,
}: EditBoardDialogProps) {
  const [name, setName] = useState(currentName);
  const [description, setDescription] = useState(currentDescription);

  const updateBoardMutation = useUpdateBoardMutation();

  // Synchronize state when dialog opens or props change
  const [lastOpen, setLastOpen] = useState(false);
  const [lastId, setLastId] = useState(boardId);

  if (open && (!lastOpen || lastId !== boardId)) {
    setLastOpen(true);
    setLastId(boardId);
    setName(currentName);
    setDescription(currentDescription);
  } else if (!open && lastOpen) {
    setLastOpen(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    updateBoardMutation.mutate(
      {
        boardId,
        data: {
          name: name.trim(),
          description: description.trim(),
        },
      },
      {
        onSuccess: () => {
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
            Rename Board
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Update the name and description of your Kanban board
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Board Name */}
          <div className="space-y-2">
            <Label
              htmlFor="board-name"
              className="text-gray-700 dark:text-gray-300"
            >
              Board Name
            </Label>
            <Input
              id="board-name"
              placeholder="e.g. Sprint Board, Project Tracker..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
              autoFocus
              required
            />
          </div>

          {/* Board Description */}
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
            <Input
              id="board-description"
              placeholder="A brief description of this board..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={updateBoardMutation.isPending}
              className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
