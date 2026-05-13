import { KanbanAPI } from "@/InfraStructure/api/kanban.api";
import { mapKanbanBoardFromApi, mapKanbanColumnFromApi, mapKanbanCardFromApi } from "@/InfraStructure/mappers/kanban.mapper";
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
import type { KanbanBoard, KanbanColumn, KanbanCard } from "@/domain/entities/kanban.entity";
interface UseCaseSuccess<T = any> {
  success: true;
  data: T;
  message: string;
}

interface UseCaseError {
  success: false;
  error: any;
  message: string;
}

type UseCaseResult<T = any> = UseCaseSuccess<T> | UseCaseError;

// Board Use Cases
export class CreateBoardUseCase {
  async execute(data: createKanBanBoardDTO): Promise<UseCaseResult> {
    try {
      const response = await KanbanAPI.createBoard(data);
      return {
        success: true,
        data: response.data,
        message: "Board created successfully"
      };
    } catch (error) {
      console.error('=== CreateBoardUseCase Error ===', error);
      return {
        success: false,
        error: error,
        message: "Failed to create board"
      };
    }
  }
}

export class GetBoardUseCase {
  async execute(boardId: string): Promise<KanbanBoard> {
    try {
      const response = await KanbanAPI.getBoard(boardId);
      return mapKanbanBoardFromApi(response.data);
    } catch (error) {
      console.error('=== GetBoardUseCase Error ===', error);
      throw error;
    }
  }
}

export class UpdateBoardUseCase {
  async execute(boardId: string, data: updateBoardInfoDTO) {
    try {
      const response = await KanbanAPI.updateBoard(boardId, data);
      return {
        success: true,
        data: response.data,
        message: "Board updated successfully"
      };
    } catch (error) {
      console.error('=== UpdateBoardUseCase Error ===', error);
      return {
        success: false,
        error: error,
        message: "Failed to update board"
      };
    }
  }
}

export class DeleteBoardUseCase {
  async execute(boardId: string) {
    try {
      await KanbanAPI.deleteBoard(boardId);
      return {
        success: true,
        message: "Board deleted successfully"
      };
    } catch (error) {
      console.error('=== DeleteBoardUseCase Error ===', error);
      return {
        success: false,
        error: error,
        message: "Failed to delete board"
      };
    }
  }
}

export class GetUserBoardsUseCase {
  async execute(): Promise<KanbanBoard[]> {
    try {
      const response = await KanbanAPI.getUserBoards();
      if (response.data && Array.isArray(response.data)) {
        return response.data.map(mapKanbanBoardFromApi);
      }
      return [];
    } catch (error) {
      console.error('=== GetUserBoardsUseCase Error ===', error);
      throw error;
    }
  }
}

// Column Use Cases
export class AddColumnUseCase {
  async execute(boardId: string, data: addColumnToBoardDTO): Promise<UseCaseResult<KanbanColumn>> {
    try {
      const response = await KanbanAPI.addColumn(boardId, data);
      return {
        success: true,
        data: mapKanbanColumnFromApi(response.data),
        message: "Column added successfully"
      };
    } catch (error: any) {
      console.error('=== AddColumnUseCase Error ===', error.response?.data || error);
      return {
        success: false,
        error: error,
        message: "Failed to add column"
      };
    }
  }
}

export class UpdateColumnUseCase {
  async execute(boardId: string, columnId: string, data: updateColumnDTO): Promise<UseCaseResult<KanbanColumn>> {
    try {
      const response = await KanbanAPI.updateColumn(boardId, columnId, data);
      return {
        success: true,
        data: mapKanbanColumnFromApi(response.data),
        message: "Column updated successfully"
      };
    } catch (error: any) {
      console.error('=== UpdateColumnUseCase Error ===', error.response?.data || error);
      return {
        success: false,
        error: error,
        message: "Failed to update column"
      };
    }
  }
}

export class DeleteColumnUseCase {
  async execute(boardId: string, columnId: string) {
    try {
      await KanbanAPI.deleteColumn(boardId, columnId);
      return {
        success: true,
        message: "Column deleted successfully"
      };
    } catch (error) {
      console.error('=== DeleteColumnUseCase Error ===', error);
      return {
        success: false,
        error: error,
        message: "Failed to delete column"
      };
    }
  }
}

export class ReorderColumnUseCase {
  async execute(boardId: string, columnId: string, data: ReorderColumnPositionDTO) {
    try {
      const response = await KanbanAPI.reorderColumn(boardId, columnId, data);
      return {
        success: true,
        data: response.data,
        message: "Column reordered successfully"
      };
    } catch (error) {
      console.error('=== ReorderColumnUseCase Error ===', error);
      return {
        success: false,
        error: error,
        message: "Failed to reorder column"
      };
    }
  }
}

// Card Use Cases
export class CreateCardUseCase {
  async execute(boardId: string, data: createCardInBoardDTO): Promise<UseCaseResult<KanbanCard>> {
    try {
      const response = await KanbanAPI.createCard(boardId, data);
      return {
        success: true,
        data: mapKanbanCardFromApi(response.data),
        message: "Card created successfully"
      };
    } catch (error) {
      console.error('=== CreateCardUseCase Error ===', error);
      return {
        success: false,
        error: error,
        message: "Failed to create card"
      };
    }
  }
}

export class UpdateCardUseCase {
  async execute(boardId: string, cardId: string, data: Partial<updateCardDTO>) {
    try {
      const response = await KanbanAPI.updateCard(boardId, cardId, data);
      return {
        success: true,
        data: mapKanbanCardFromApi(response.data),
        message: "Card updated successfully"
      };
    } catch (error) {
      console.error('=== UpdateCardUseCase Error ===', error);
      return {
        success: false,
        error: error,
        message: "Failed to update card"
      };
    }
  }
}

export class DeleteCardUseCase {
  async execute(boardId: string, cardId: string) {
    try {
      await KanbanAPI.deleteCard(boardId, cardId);
      return {
        success: true,
        message: "Card deleted successfully"
      };
    } catch (error) {
      console.error('=== DeleteCardUseCase Error ===', error);
      return {
        success: false,
        error: error,
        message: "Failed to delete card"
      };
    }
  }
}

export class MoveCardBetweenColumnsUseCase {
  async execute(boardId: string, cardId: string, data: moveCardsBetweenColumnsDTO) {
    try {
      const response = await KanbanAPI.moveCardBetweenColumns(boardId, cardId, data);
      return {
        success: true,
        data: response.data,
        message: "Card moved successfully"
      };
    } catch (error) {
      console.error('=== MoveCardBetweenColumnsUseCase Error ===', error);
      return {
        success: false,
        error: error,
        message: "Failed to move card"
      };
    }
  }
}

export class ReorderCardInColumnUseCase {
  async execute(boardId: string, cardId: string, data: ReorderCardWithInColumnDTO) {
    try {
      const response = await KanbanAPI.reorderCardInColumn(boardId, cardId, data);
      return {
        success: true,
        data: response.data,
        message: "Card reordered successfully"
      };
    } catch (error) {
      console.error('=== ReorderCardInColumnUseCase Error ===', error);
      return {
        success: false,
        error: error,
        message: "Failed to reorder card"
      };
    }
  }
}

export class DeleteKanbanBoardUseCase {
  async execute(boardId: string) {
    try {
      const response = await KanbanAPI.deleteBoard(boardId);
      return {
        success: true,
        data: response,
        message: "Board Deleted Successfully"
      }
    } catch (error) {
      console.error('=== DeleteKanbanBoardUseCase Error ===', error);
      return {
        success: false,
        error: error,
        message: "Failed to delete kanban board"
      };
    }
  }
}