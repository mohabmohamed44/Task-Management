import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetTaskQueryDTO } from "@/domain/entities/get-tasks-query.dto";
import type { CreateTaskDTO, UpdateTaskDTO } from "@/domain/entities/task.dto";
import { GetTasksUseCase, CreateTaskUseCase, GetTaskByIdUseCase, UpdateTaskUseCase, DeleteTaskUseCase, GetUserStatsUseCase, GetTaskHistoryUseCase } from "@/domain/usecases/task.usecases";

const getTasksUseCase = new GetTasksUseCase();
const createTaskUseCase = new CreateTaskUseCase();
const getTaskByIdUseCase = new GetTaskByIdUseCase();
const updateTaskUseCase = new UpdateTaskUseCase();
const deleteTaskUsecase = new DeleteTaskUseCase();
const getUserStatsUseCase = new GetUserStatsUseCase();
const getTaskHistoryUseCase = new GetTaskHistoryUseCase();

export const useTasksQuery = (query: GetTaskQueryDTO) =>
  useQuery({
    queryKey: ["tasks", query],
    queryFn: () => getTasksUseCase.execute(query), 
    staleTime: 1000 * 60 * 5,
  });

export const useTaskQuery = (id: string | undefined) =>
  useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskByIdUseCase.execute(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDTO) => createTaskUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateTaskDTO }) => 
      updateTaskUseCase.execute(id.toString(), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.id.toString()] });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id}: {id: string | number}) => {
      return deleteTaskUsecase.execute(id.toString());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  })
};

export const useUserStatsQuery = () =>
  useQuery({
    queryKey: ["task-stats"],
    queryFn: () => getUserStatsUseCase.execute(),
    staleTime: 1000 * 60 * 5,
  });


export const useGetTaskHistory = (id: string | number) =>
  useQuery({
    queryKey: ["task-history"],
    queryFn: () => getTaskHistoryUseCase.execute(id.toString()),
    staleTime: 1000 * 60 * 5,
  });