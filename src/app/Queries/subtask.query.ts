import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSubTaskDTO, UpdateSubTaskDTO } from "@/domain/entities/subTask.dto";
import type { GetSubTasksQueryDTO } from "@/domain/entities/get-subtasks-query.dto";
import { 
  CreateSubTaskUseCase, 
  UpdateSubTaskUseCase, 
  GetSubTasksUseCase,
  GetSubTaskByIdUseCase,
  DeleteSubTaskUseCase 
} from "@/domain/usecases/subtask.usecases";

const getSubTasksUseCase = new GetSubTasksUseCase();
const createSubTaskUseCase = new CreateSubTaskUseCase();
const updateSubTaskUseCase = new UpdateSubTaskUseCase();
const getSubTaskByIdUseCase = new GetSubTaskByIdUseCase();
const deleteSubTaskUseCase = new DeleteSubTaskUseCase();

export const useSubTasksQuery = (query: GetSubTasksQueryDTO) =>
  useQuery({
    queryKey: ["subtasks", query.taskId],
    queryFn: () => getSubTasksUseCase.execute(query.taskId.toString()),
    enabled: !!query.taskId,
    staleTime: 1000 * 60 * 5,
  });

export const useSubTaskQuery = (taskId: string, subTaskId: string) =>
  useQuery({
    queryKey: ["subtask", taskId, subTaskId],
    queryFn: () => getSubTaskByIdUseCase.execute(taskId, subTaskId),
    enabled: !!taskId && !!subTaskId,
    staleTime: 1000 * 60 * 5,
  });

export const useCreateSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: CreateSubTaskDTO }) => 
      createSubTaskUseCase.execute(taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subtasks", variables.taskId] });
    },
  });
};

export const useUpdateSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      taskId, 
      subTaskId, 
      data 
    }: { 
      taskId: string; 
      subTaskId: string; 
      data: UpdateSubTaskDTO 
    }) => updateSubTaskUseCase.execute(taskId, subTaskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subtasks", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["subtask", variables.taskId, variables.subTaskId] });
    },
  });
};

export const useDeleteSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, subTaskId }: { taskId: string; subTaskId: string }) => 
      deleteSubTaskUseCase.execute(taskId, subTaskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subtasks", variables.taskId] });
    },
  });
};