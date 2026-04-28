import { useNavigate } from "react-router";
import { useTaskQuery, useUpdateTaskMutation, useDeleteTaskMutation, useGetTaskHistory } from "@/app/Queries/task.query";
import { TaskUpdateForm } from "@/presentation/components/TaskUpdateForm";
import { useGlobalModal } from '@/app/hooks/useGlobalModal';
import { Button } from "@/presentation/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/presentation/components/ui/dialog";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";
import type { UpdateTaskDTO } from "@/domain/entities/task.dto";

export function useTaskDetails(taskId?: string) {
  const navigate = useNavigate();
  const { data: task, isLoading, error } = useTaskQuery(taskId);
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const { openModal, closeModal } = useGlobalModal();
  const { data: taskHistory, isLoading: isHistoryLoading } = useGetTaskHistory(taskId || '');

  const toggleComplete = async () => {
    if (!task) return;
    
    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        data: { completed: !task.completed },
      });
      
      toast.success(`Task ${!task.completed ? 'completed' : 'marked as incomplete'}`, {
        duration: 2000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Failed to update task completion:', error);
      toast.error('Failed to update task completion');
    }
  };

  const updateTask = async (updateData: UpdateTaskDTO) => {
    if (!task) return;
    
    try {
      await updateTaskMutation.mutateAsync({ id: task.id, data: updateData });
      closeModal();
      toast.success('Task Updated Successfully', {
        duration: 2000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const openUpdateModal = () => {
    if (!task) return;
    
    openModal( 
      <TaskUpdateForm 
        task={task}
        onSubmit={updateTask}
        onCancel={closeModal}
        isLoading={updateTaskMutation.isPending}
      />
    );
  };

  const goBackToTasks = () => {
    navigate('/tasks');
  };

  const handleDeleteTask = async () => {
    if (!task) return;

    try {
      await deleteTaskMutation.mutateAsync({ id: task.id });
      closeModal();
      toast.success('Task deleted successfully', {
        duration: 2000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const openDeleteConfirmation = () => {
    if (!task) return;

    openModal(
      <Dialog open onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Task
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "<strong>{task.title}</strong>"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTask}
              disabled={deleteTaskMutation.isPending}
            >
              {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return {
    task,
    isLoading,
    error,
    navigate,
    toggleComplete,
    openUpdateModal,
    openDeleteConfirmation,
    goBackToTasks,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    taskHistory,
    isHistoryLoading,
  };
}
