import { useNavigate } from "react-router";
import { useTaskQuery, useUpdateTaskMutation } from "@/app/Queries/task.query";
import { TaskUpdateForm } from "@/presentation/components/TaskUpdateForm";
import { useGlobalModal } from '@/app/hooks/useGlobalModal';
import toast from "react-hot-toast";
import type { UpdateTaskDTO } from "@/domain/entities/task.dto";

export function useTaskDetails(taskId?: string) {
  const navigate = useNavigate();
  const { data: task, isLoading, error } = useTaskQuery(taskId);
  const updateTaskMutation = useUpdateTaskMutation();
  const { openModal, closeModal } = useGlobalModal();

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

  return {
    task,
    isLoading,
    error,
    navigate,
    toggleComplete,
    openUpdateModal,
    goBackToTasks,
    isUpdating: updateTaskMutation.isPending,
  };
}
