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
import { Badge } from "@/presentation/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { TaskPriority } from "@/domain/enums/task-priority.enum";
import { useUpdateCardMutation, useDeleteCardMutation } from "@/app/Queries/kanban.query";
import type { Task } from "@/domain/entities/task.entity";

interface CardDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  task: Task | null;
}

export function CardDetailDialog({
  open,
  onOpenChange,
  boardId,
  task,
}: CardDetailDialogProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? TaskPriority.Medium);

  const updateCardMutation = useUpdateCardMutation();
  const deleteCardMutation = useDeleteCardMutation();

  const [lastOpen, setLastOpen] = useState(false);
  const [lastTaskId, setLastTaskId] = useState(task?.id);

  if (open && (!lastOpen || lastTaskId !== task?.id)) {
    setLastOpen(true);
    setLastTaskId(task?.id);
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setPriority(task?.priority ?? TaskPriority.Medium);
  } else if (!open && lastOpen) {
    setLastOpen(false);
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !title.trim()) return;

    updateCardMutation.mutate(
      {
        boardId,
        cardId: task.id.toString(),
        data: {
          title: title.trim(),
          description: description.trim(),
          priority,
        },
      },
      {
        onSuccess: () =>{ 
          onOpenChange(false)
          toast.success("Card updated successfully");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || error.message || "Failed to update card");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!task) return;

    if (confirm("Are you sure you want to delete this card?")) {
      deleteCardMutation.mutate(
        { boardId, cardId: task.id.toString() },
        {
          onSuccess: () => onOpenChange(false),
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message || "Failed to delete card");
          },
        }
      );
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Card Details
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            View and edit card details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="detail-title" className="text-gray-700 dark:text-gray-300">Title</Label>
            <Input
              id="detail-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail-description" className="text-gray-700 dark:text-gray-300">Description</Label>
            <Textarea
              id="detail-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-24 resize-none"
            />
          </div>

<div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Priority</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority)}>
                <SelectTrigger className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <SelectItem value={TaskPriority.Low}>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" /> Low
                    </span>
                  </SelectItem>
                  <SelectItem value={TaskPriority.Medium}>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium
                    </span>
                  </SelectItem>
                  <SelectItem value={TaskPriority.High}>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500" /> High
                    </span>
                  </SelectItem>
                  <SelectItem value={TaskPriority.Urgent}>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500" /> Urgent
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

          {task.tags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created: {task.createdAt instanceof Date ? task.createdAt.toLocaleDateString() : "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated: {task.updatedAt instanceof Date ? task.updatedAt.toLocaleDateString() : "N/A"}
            </span>
          </div>

          <DialogFooter className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              loading={deleteCardMutation.isPending}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
            >
              Delete
            </Button>
            <div className="flex gap-2">
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
                loading={updateCardMutation.isPending}
                className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
              >
                Save
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}