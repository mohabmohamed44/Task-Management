import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GetUserBoardsUseCase,
  GetBoardUseCase,
  CreateBoardUseCase,
  UpdateBoardUseCase,
  DeleteBoardUseCase,
  AddColumnUseCase,
  UpdateColumnUseCase,
  DeleteColumnUseCase,
  ReorderColumnUseCase,
  CreateCardUseCase,
  UpdateCardUseCase,
  DeleteCardUseCase,
  MoveCardBetweenColumnsUseCase,
  ReorderCardInColumnUseCase,
  DeleteKanbanBoardUseCase
} from "@/domain/usecases/kanban.usecases";
import type {
  createKanBanBoardDTO,
  updateBoardInfoDTO,
  addColumnToBoardDTO,
  createCardInBoardDTO,
  moveCardsBetweenColumnsDTO,
  ReorderColumnPositionDTO,
  ReorderCardWithInColumnDTO
} from "@/domain/entities/kanban.dto";
import toast from "react-hot-toast";

// Query Keys
export const kanbanQueryKeys = {
  boards: () => ["kanban", "boards"] as const,
  board: (boardId: string) => ["kanban", "board", boardId] as const,
  columns: (boardId: string) => ["kanban", "board", boardId, "columns"] as const,
  cards: (boardId: string) => ["kanban", "board", boardId, "cards"] as const,
};

// Queries
export const useKanbanBoardsQuery = () => {
  return useQuery({
    queryKey: kanbanQueryKeys.boards(),
    queryFn: async () => {
      const useCase = new GetUserBoardsUseCase();
      return useCase.execute();
    },
  });
};

export const useKanbanBoardQuery = (boardId: string) => {
  return useQuery({
    queryKey: kanbanQueryKeys.board(boardId),
    queryFn: async () => {
      const useCase = new GetBoardUseCase();
      return useCase.execute(boardId);
    },
    enabled: !!boardId,
  });
};

// Board Mutations
export const useCreateBoardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: createKanBanBoardDTO) => {
      const useCase = new CreateBoardUseCase();
      const result = await useCase.execute(data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.boards() });
    },
  });
};

export const useUpdateBoardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, data }: { boardId: string; data: updateBoardInfoDTO }) => {
      const useCase = new UpdateBoardUseCase();
      const result = await useCase.execute(boardId, data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.board(boardId) });
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.boards() });
    },
  });
};

export const useDeleteBoardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (boardId: string) => {
      const useCase = new DeleteBoardUseCase();
      const result = await useCase.execute(boardId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.boards() });
    },
  });
};

// Column Mutations
export const useAddColumnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, data }: { boardId: string; data: addColumnToBoardDTO }) => {
      const useCase = new AddColumnUseCase();
      const result = await useCase.execute(boardId, data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.board(boardId) });
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.columns(boardId) });
    },
  });
};

export const useUpdateColumnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, columnId, data }: { boardId: string; columnId: string; data: Partial<addColumnToBoardDTO> }) => {
      const useCase = new UpdateColumnUseCase();
      const result = await useCase.execute(boardId, columnId, data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.board(boardId) });
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.columns(boardId) });
    },
  });
};

export const useDeleteColumnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, columnId }: { boardId: string; columnId: string }) => {
      const useCase = new DeleteColumnUseCase();
      const result = await useCase.execute(boardId, columnId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.board(boardId) });
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.columns(boardId) });
    },
  });
};

export const useReorderColumnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, columnId, data }: { boardId: string; columnId: string; data: ReorderColumnPositionDTO }) => {
      const useCase = new ReorderColumnUseCase();
      const result = await useCase.execute(boardId, columnId, data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.board(boardId) });
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.columns(boardId) });
    },
  });
};

// Card Mutations
export const useCreateCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, data }: { boardId: string; data: createCardInBoardDTO }) => {
      const useCase = new CreateCardUseCase();
      const result = await useCase.execute(boardId, data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.board(boardId) });
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.cards(boardId) });
    },
  });
};

export const useUpdateCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, cardId, data }: { boardId: string; cardId: string; data: Partial<createCardInBoardDTO> }) => {
      const useCase = new UpdateCardUseCase();
      const result = await useCase.execute(boardId, cardId, data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.board(boardId) });
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.cards(boardId) });
    },
  });
};

export const useDeleteCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, cardId }: { boardId: string; cardId: string }) => {
      const useCase = new DeleteCardUseCase();
      const result = await useCase.execute(boardId, cardId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.board(boardId) });
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.cards(boardId) });
    },
  });
};

export const useMoveCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, cardId, data }: { boardId: string; cardId: string; data: moveCardsBetweenColumnsDTO }) => {
      const useCase = new MoveCardBetweenColumnsUseCase();
      const result = await useCase.execute(boardId, cardId, data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.board(boardId) });
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.cards(boardId) });
    },
  });
};

export const useReorderCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, cardId, data }: { boardId: string; cardId: string; data: ReorderCardWithInColumnDTO }) => {
      const useCase = new ReorderCardInColumnUseCase();
      const result = await useCase.execute(boardId, cardId, data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.board(boardId) });
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.cards(boardId) });
    },
  });
};

export const useDeleteKanboardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async({boardId}: {boardId: string}) => {
      const useCase = new DeleteKanbanBoardUseCase();
      const result = await useCase.execute(boardId);
      if(!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: (_, {boardId}) => {
      // Invalidate boards list to refresh the UI
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.boards() });
      // Invalidate specific board cache if it exists
      queryClient.invalidateQueries({ queryKey: kanbanQueryKeys.board(boardId) });
      toast.success("Board deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete board");
    },
  })
}