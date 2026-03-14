import { api } from "@/InfraStructure/api/http";
import type {
  createKanBanBoardDTO,
  addColumnToBoardDTO,
  createCardInBoardDTO,
  moveCardsBetweenColumnsDTO,
  ReorderColumnPositionDTO,
  ReorderCardWithInColumnDTO,
  updateBoardInfoDTO,
  updateColumnDTO,
  updateCardDTO
} from "@/domain/entities/kanban.dto";

export const KanbanAPI = {
  createBoard: (data: createKanBanBoardDTO) =>
    api.post("/kanban/boards", data),

  getBoard: (boardId: string) =>
    api.get(`/kanban/boards/${boardId}`),

  updateBoard: (boardId: string, data: updateBoardInfoDTO) =>
    api.put(`/kanban/boards/${boardId}`, data),

  deleteBoard: (boardId: string) =>
    api.delete(`/kanban/boards/${boardId}`),

  getUserBoards: () =>
    api.get("/kanban/boards"),

  // Column operations
  addColumn: (boardId: string, data: addColumnToBoardDTO) =>
    api.post(`/kanban/boards/${boardId}/columns`, data),

  updateColumn: (_boardId: string, columnId: string, updateColumnDTO: Partial<updateColumnDTO>) =>
    api.put(`/kanban/columns/${columnId}`, updateColumnDTO),

  deleteColumn: (boardId: string, columnId: string) =>
    api.delete(`/kanban/boards/${boardId}/columns/${columnId}`),

  reorderColumn: (boardId: string, columnId: string, data: ReorderColumnPositionDTO) =>
    api.post(`/kanban/boards/${boardId}/columns/${columnId}/reorder`, data),

  // Card/Task operations
  createCard: (boardId: string, data: createCardInBoardDTO) =>
    api.post(`/kanban/boards/${boardId}/cards`, data),

  updateCard: (boardId: string, cardId: string, data: Partial<updateCardDTO>) =>
    api.put(`/kanban/boards/${boardId}/cards/${cardId}`, data),

  deleteCard: (boardId: string, cardId: string) =>
    api.delete(`/kanban/boards/${boardId}/cards/${cardId}`),

  moveCardBetweenColumns: (boardId: string, cardId: string, data: moveCardsBetweenColumnsDTO) =>
    api.post(`/kanban/boards/${boardId}/cards/${cardId}/move`, data),

  reorderCardInColumn: (boardId: string, cardId: string, data: ReorderCardWithInColumnDTO) =>
    api.post(`/kanban/boards/${boardId}/cards/${cardId}/reorder`, data),
};