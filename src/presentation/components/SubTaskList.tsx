import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { Badge } from "@/presentation/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useSubTasksQuery, useCreateSubTaskMutation, useUpdateSubTaskMutation, useDeleteSubTaskMutation } from "@/app/Queries/subtask.query";
import type { subTaskApiResponse } from "@/domain/entities/subTask-api.response";
import toast from "react-hot-toast";
import { useSanitizedForm } from "@/app/hooks/useSanitizedForm";


export default function SubTaskList({ taskId }: { taskId: string }) {
  const [newSubTaskText, setNewSubTaskText] = useState("");
  
  const { data: subtasks, isLoading, error } = useSubTasksQuery({ taskId });
  const createSubTaskMutation = useCreateSubTaskMutation();
  const updateSubTaskMutation = useUpdateSubTaskMutation();
  const deleteSubTaskMutation = useDeleteSubTaskMutation();
  
  // Initialize sanitization hook for subtask text
  const { sanitizeValues } = useSanitizedForm<{ text: string }>({
    text: 'text'
  });

  const handleCreateSubTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTaskText.trim()) return;

    try {
      // Sanitize the subtask text before creating
      const sanitized = sanitizeValues({ text: newSubTaskText });
      
      const existingSubtasks = Array.isArray(subtasks) ? subtasks : [];
      const maxPosition = existingSubtasks.reduce((max, st) => {
        const pos = typeof st.position === "number" ? st.position : Number(st.position);
        return Number.isFinite(pos) ? Math.max(max, pos) : max;
      }, 0);
      const nextPosition = maxPosition + 1;

      await createSubTaskMutation.mutateAsync({
        taskId,
        data: { text: sanitized.text.trim(), position: nextPosition }
      });
      setNewSubTaskText("");
      toast.success("Subtask created successfully");
    } catch {
      toast.error("Failed to create subtask");
    }
  };

  const handleToggleSubTask = async (subTaskId: string, currentCompleted: boolean) => {
    try {
      await updateSubTaskMutation.mutateAsync({
        taskId,
        subTaskId,
        data: { completed: !currentCompleted }
      });
      toast.success("Subtask updated successfully");
    } catch {
      toast.error("Failed to update subtask");
    }
  };

  const handleDeleteSubTask = async (subTaskId: string) => {
    try {
      await deleteSubTaskMutation.mutateAsync({ taskId, subTaskId });
      toast.success("Subtask deleted successfully");
    } catch {
      toast.error("Failed to delete subtask");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subtasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subtasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load subtasks</p>
        </CardContent>
      </Card>
    );
  }

  const completedCount = subtasks?.filter(st => st.completed).length || 0;
  const totalCount = subtasks?.length || 0;
  
  // Sort subtasks by position
  const sortedSubtasks = [...(subtasks ?? [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Subtasks</CardTitle>
          <Badge variant="secondary">
            {completedCount}/{totalCount} completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new subtask form */}
        <form onSubmit={handleCreateSubTask} className="flex gap-2">
          <Input
            placeholder="Add a new subtask..."
            value={newSubTaskText}
            onChange={(e) => setNewSubTaskText(e.target.value)}
            className="flex-1"
            disabled={createSubTaskMutation.isPending}
            aria-label="Add a new subtask"
            aria-required="true"
            aria-invalid={!!newSubTaskText}
            aria-describedby="new-subtask-error"
            aria-pressed={!!newSubTaskText}
            name="new-subtask"
            id="new-subtask"
          />
          <Button 
            type="submit" 
            size="sm"
            aria-label="Add a new subtask"
            aria-required="true"
            aria-invalid={!!newSubTaskText}
            aria-describedby="new-subtask-error"
            aria-pressed={!!newSubTaskText}
            name="new-subtask"
            id="new-subtask"
            disabled={createSubTaskMutation.isPending || !newSubTaskText.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {/* Subtasks list */}
        <div className="space-y-2">
          {sortedSubtasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No subtasks yet. Add one above to get started.
            </p>
          ) : (
            sortedSubtasks.map((subtask: subTaskApiResponse) => (
              <div
                key={subtask.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={() => handleToggleSubTask(subtask.id.toString(), subtask.completed)}
                  disabled={updateSubTaskMutation.isPending}
                />
                <span 
                  className={`flex-1 text-sm ${
                    subtask.completed 
                      ? "line-through text-muted-foreground" 
                      : "text-foreground"
                  }`}
                >
                  {subtask.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Delete subtask"
                  aria-required="true"
                  aria-invalid={!!subtask.id}
                  aria-describedby="delete-subtask-error"
                  aria-pressed={!!subtask.id}
                  name="delete-subtask"
                  id="delete-subtask"
                  onClick={() => handleDeleteSubTask(subtask.id.toString())}
                  disabled={deleteSubTaskMutation.isPending}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
