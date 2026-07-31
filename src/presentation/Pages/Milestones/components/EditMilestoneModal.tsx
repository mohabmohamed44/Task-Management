import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/Button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";

interface EditMilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone: any | null;
  onSubmit: (milestoneId: string, data: { title?: string; completed?: boolean }) => void;
  isPending?: boolean;
}

function getMilestoneStatus(milestone: any): string {
  if (typeof milestone?.status === "string" && milestone.status.trim()) return milestone.status;
  return milestone?.progress === 100 || milestone?.completed === true ? "Completed" : "Pending";
}

export function EditMilestoneModal({
  open,
  onOpenChange,
  milestone,
  onSubmit,
  isPending,
}: EditMilestoneModalProps) {
  const milestoneId = milestone?.id ? String(milestone.id) : null;

  const initialForm = useMemo(() => ({
    title: milestone?.title ?? "",
    status: getMilestoneStatus(milestone),
  }), [milestone]);

  const [prevMilestoneId, setPrevMilestoneId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  // Reset form when a different milestone is selected or the modal opens
  if (milestoneId !== prevMilestoneId) {
    setPrevMilestoneId(milestoneId);
    setForm(initialForm);
  }

  if (!milestone || !milestoneId) return null;

  const handleSave = () => {
    if (!form.title.trim()) return;

    const isCompleted = form.status === "Completed" || form.status === "completed";
    onSubmit(milestoneId, {
      title: form.title,
      completed: isCompleted,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="font-montserrat text-gray-900 dark:text-white">
            Edit Milestone
          </DialogTitle>
          <DialogDescription className="font-inter text-gray-600 dark:text-gray-400">
            Update milestone information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-milestone-title" className="font-inter text-sm font-medium text-gray-700 dark:text-gray-300">
              Milestone Title
            </Label>
            <Input
              id="edit-milestone-title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="rounded border-gray-300 font-inter focus-visible:border-black dark:border-gray-700 dark:focus-visible:border-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-inter text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </Label>
            <Select value={form.status} onValueChange={(value) => setForm((p) => ({ ...p, status: value }))}>
              <SelectTrigger className="rounded border-gray-300 font-inter dark:border-gray-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white font-inter dark:bg-gray-900">
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded border-gray-300 font-montserrat text-[11px] font-bold uppercase tracking-widest text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={!!isPending}
            className="rounded bg-gray-900 font-montserrat text-[11px] font-bold uppercase tracking-widest text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
