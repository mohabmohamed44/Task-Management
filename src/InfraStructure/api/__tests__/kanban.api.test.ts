import { describe, it, expect, vi, beforeEach } from 'vitest';
import { KanbanAPI } from '../kanban.api';
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
} from '@/domain/entities/kanban.dto';
import {TaskPriority} from "@/domain/enums/task-priority.enum";
const { apiClientMock } = vi.hoisted(() => {
    const apiClientMock = {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
            request: {
                use: vi.fn(),
            },
            response: {
                use: vi.fn(),
            },
        },
    };

    return { apiClientMock };
});

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => apiClientMock),
    },
}));

describe('KanbanAPI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createBoard', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const mockData: createKanBanBoardDTO = {
                name: 'Test Board',
                description: 'A test board',
            };

            const fullResponse = {
                data: { id: 1, name: 'Test Board', description: 'A test board' },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.createBoard(mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith('/kanban/boards', mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getBoard', () => {
        it('Should call api.get with correct URL and return the response', async () => {
            const boardId = '1';

            const fullResponse = {
                data: { id: 1, name: 'Test Board', columns: [] },
                status: 200,
            };

            apiClientMock.get.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.getBoard(boardId);

            expect(apiClientMock.get).toHaveBeenCalledWith(`/kanban/boards/${boardId}`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('updateBoard', () => {
        it('Should call api.put with correct URL and data, and return the response', async () => {
            const boardId = '1';
            const mockData: updateBoardInfoDTO = {
                name: 'Updated Board',
                description: 'Updated description',
            };

            const fullResponse = {
                data: { id: 1, name: 'Updated Board', description: 'Updated description' },
                status: 200,
            };

            apiClientMock.put.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.updateBoard(boardId, mockData);

            expect(apiClientMock.put).toHaveBeenCalledWith(`/kanban/boards/${boardId}`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('deleteBoard', () => {
        it('Should call api.delete with correct URL and return the response', async () => {
            const boardId = '1';

            const fullResponse = {
                data: { message: 'Board deleted' },
                status: 200,
            };

            apiClientMock.delete.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.deleteBoard(boardId);

            expect(apiClientMock.delete).toHaveBeenCalledWith(`/kanban/boards/${boardId}`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getUserBoards', () => {
        it('Should call api.get with correct URL and return the response', async () => {
            const fullResponse = {
                data: [{ id: 1, name: 'Board 1' }, { id: 2, name: 'Board 2' }],
                status: 200,
            };

            apiClientMock.get.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.getUserBoards();

            expect(apiClientMock.get).toHaveBeenCalledWith('/kanban/boards');
            expect(result).toEqual(fullResponse);
        });
    });

    describe('addColumn', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const boardId = '1';
            const mockData: addColumnToBoardDTO = {
                board_id: Number(boardId),
                name: 'Test Column',
                color: '#ffffff',
                position: 1,
            };

            const fullResponse = {
                data: { id: 1, board_id: 1, name: 'Test Column', color: '#ffffff', position: 1 },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.addColumn(boardId, mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith(`/kanban/boards/${boardId}/columns`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('updateColumn', () => {
        it('Should call api.put with correct URL and data, and return the response', async () => {
            const boardId = '1';
            const columnId = '1';
            const mockData: Partial<updateColumnDTO> = {
                name: 'Updated Column',
            };

            const fullResponse = {
                data: { id: 1, name: 'Updated Column', color: '#ffffff', position: 1 },
                status: 200,
            };

            apiClientMock.put.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.updateColumn(boardId, columnId, mockData);

            expect(apiClientMock.put).toHaveBeenCalledWith(`/kanban/columns/${columnId}`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('deleteColumn', () => {
        it('Should call api.delete with correct URL and return the response', async () => {
            const boardId = '1';
            const columnId = '1';

            const fullResponse = {
                data: { message: 'Column deleted' },
                status: 200,
            };

            apiClientMock.delete.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.deleteColumn(boardId, columnId);

            expect(apiClientMock.delete).toHaveBeenCalledWith(`/kanban/boards/${boardId}/columns/${columnId}`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('reorderColumn', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const boardId = '1';
            const columnId = '1';
            const mockData: ReorderColumnPositionDTO = {
                newPosition: 2,
            };

            const fullResponse = {
                data: { id: 1, position: 2 },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.reorderColumn(boardId, columnId, mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith(`/kanban/boards/${boardId}/columns/${columnId}/reorder`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('createCard', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const boardId = '1';
            const mockData: createCardInBoardDTO = {
                column_id: 1,
                title: 'Test Card',
                description: 'A test card',
                priority: TaskPriority.Medium,
            };

            const fullResponse = {
                data: { id: 1, column_id: 1, title: 'Test Card', description: 'A test card', priority: 'medium' },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.createCard(boardId, mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith(`/kanban/boards/${boardId}/cards`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('updateCard', () => {
        it('Should call api.put with correct URL and data, and return the response', async () => {
            const boardId = '1';
            const cardId = '1';
            const mockData: Partial<updateCardDTO> = {
                title: 'Updated Card',
            };

            const fullResponse = {
                data: { id: 1, title: 'Updated Card' },
                status: 200,
            };

            apiClientMock.put.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.updateCard(boardId, cardId, mockData);

            expect(apiClientMock.put).toHaveBeenCalledWith(`/kanban/boards/${boardId}/cards/${cardId}`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('deleteCard', () => {
        it('Should call api.delete with correct URL and return the response', async () => {
            const boardId = '1';
            const cardId = '1';

            const fullResponse = {
                data: { message: 'Card deleted' },
                status: 200,
            };

            apiClientMock.delete.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.deleteCard(boardId, cardId);

            expect(apiClientMock.delete).toHaveBeenCalledWith(`/kanban/boards/${boardId}/cards/${cardId}`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('moveCardBetweenColumns', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const boardId = '1';
            const cardId = '1';
            const mockData: moveCardsBetweenColumnsDTO = {
                columnId: 2,
                newPosition: 1,
            };

            const fullResponse = {
                data: { id: 1, column_id: 2, position: 1 },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.moveCardBetweenColumns(boardId, cardId, mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith(`/kanban/boards/${boardId}/cards/${cardId}/move`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('reorderCardInColumn', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const boardId = '1';
            const cardId = '1';
            const mockData: ReorderCardWithInColumnDTO = {
                columnId: 1,
                newPosition: 3,
            };

            const fullResponse = {
                data: { id: 1, position: 3 },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await KanbanAPI.reorderCardInColumn(boardId, cardId, mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith(`/kanban/boards/${boardId}/cards/${cardId}/reorder`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });
});