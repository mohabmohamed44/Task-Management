import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCommentRequest, UpdateCommentRequest } from "@/domain/entities/comments.dto";
import type { GetCommentsQuery } from "@/domain/entities/get-comments-query.dto";

import {CreateCommentUseCase, UpdateCommentUseCase, GetCommentsUseCase, DeleteCommentUseCase} from "@/domain/usecases/comments.usecases";

const createCommentUseCase = new CreateCommentUseCase();
const updateCommentUseCase = new UpdateCommentUseCase();
const getCommentsUseCase = new GetCommentsUseCase();
const deleteCommentUseCase = new DeleteCommentUseCase();



export const useCommentsQuery = (query: GetCommentsQuery) =>
  useQuery({
    queryKey: ["comments", query.task_id],
    queryFn: () => getCommentsUseCase.execute(query.task_id.toString()),
    enabled: !!query.task_id,
    staleTime: 1000 * 60 * 5,
  });

export const useCreateCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, data }: { taskId: string; data: CreateCommentRequest }) => createCommentUseCase.execute(taskId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
}

export const useDeleteCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, subTaskId }: { taskId: string; subTaskId: string }) => deleteCommentUseCase.execute(taskId, subTaskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
}

export const useUpdateCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({taskId, subTaskId, data}: {taskId: string; subTaskId: string; data: UpdateCommentRequest}) => updateCommentUseCase.execute(taskId, subTaskId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    })
}