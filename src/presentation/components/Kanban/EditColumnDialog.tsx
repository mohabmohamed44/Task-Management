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
import { Label } from "@/presentation/components/ui/label";

import { useUpdateColumnMutation } from "@/app/Queries/kanban.query";
import { Input } from "../ui/input";

// Predefined column color palette (same as AddColumnDialog)
const COLUMN_COLORS = [
  { value: "bg-blue-500", label: "Blue", hex: "#3b82f6" },
  { value: "bg-green-500", label: "Green", hex: "#22c55e" },
  { value: "bg-yellow-500", label: "Yellow", hex: "#eab308" },
  { value: "bg-red-500", label: "Red", hex: "#ef4444" },
  { value: "bg-purple-500", label: "Purple", hex: "#a855f7" },
  { value: "bg-pink-500", label: "Pink", hex: "#ec4899" },
  { value: "bg-indigo-500", label: "Indigo", hex: "#6366f1" },
  { value: "bg-teal-500", label: "Teal", hex: "#14b8a6" },
  { value: "bg-orange-500", label: "Orange", hex: "#f97316" },
  { value: "bg-gray-500", label: "Gray", hex: "#6b7280" },
];

interface EditColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  columnId: string;
  currentName: string;
  currentColor: string;
}

export function EditColumnDialog({
  open,
  onOpenChange,
  boardId,
  columnId,
  currentName,
  currentColor,
}: EditColumnDialogProps) {
  const [name, setName] = useState(currentName);
  const [color, setColor] = useState(currentColor);

  const updateColumnMutation = useUpdateColumnMutation();

  // Synchronize state when dialog opens or props change
  const [lastOpen, setLastOpen] = useState(false);
  const [lastColumnId, setLastColumnId] = useState(columnId);

  if (open && (!lastOpen || lastColumnId !== columnId)) {
    // Graceful fallback: convert old Tailwind classes from DB to correct hex for the color picker
    const initialColor = currentColor.startsWith('#') 
      ? currentColor 
      : (COLUMN_COLORS.find(c => c.value === currentColor)?.hex || COLUMN_COLORS[0].hex);

    setLastOpen(true);
    setLastColumnId(columnId);
    setName(currentName);
    setColor(initialColor);
  } else if (!open && lastOpen) {
    setLastOpen(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    updateColumnMutation.mutate(
      {
        boardId,
        columnId,
        data: {
          name: name.trim(),
          color,
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
            Rename Column
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Update the name and color of this column
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Column Name */}
          <div className="space-y-2">
            <Label
              htmlFor="edit-column-name"
              className="text-gray-700 dark:text-gray-300"
            >
              Column Name
            </Label>
            <Input
              id="edit-column-name"
              placeholder="e.g. In Progress, Review, Done..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
              autoFocus
              required
            />
          </div>

          {/* Column Color */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">
              Column Color
            </Label>
            <div className="flex flex-wrap gap-2">
              {COLUMN_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className={`
                    w-8 h-8 rounded-full transition-all duration-200 border-2
                    ${
                      color === c.hex
                        ? "border-gray-900 dark:border-white scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                        : "border-transparent hover:scale-105"
                    }
                  `}
                  style={{ backgroundColor: c.hex }}
                  aria-label={`Select ${c.label} color`}
                  title={c.label}
                />
              ))}
            </div>
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
              loading={updateColumnMutation.isPending}
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
