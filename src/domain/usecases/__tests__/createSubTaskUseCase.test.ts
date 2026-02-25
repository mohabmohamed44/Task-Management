import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateSubTaskUseCase } from '../subtask.usecases';
import { subTaskAPI } from '@/InfraStructure/api/subTask.api';
import type { CreateSubTaskDTO } from '@/domain/entities/subTask.dto';
import type { subTaskApiResponse } from '@/domain/entities/subTask-api.response';

// Mock subTaskAPI
vi.mock('@/InfraStructure/api/subTask.api', () => ({
  subTaskAPI: {
    create: vi.fn(),
  },
}));

describe('CreateSubTaskUseCase', () => {
    let createSubTaskUseCase: CreateSubTaskUseCase;
    const mockCreate = vi.mocked(subTaskAPI.create);

    beforeEach(() => {
        createSubTaskUseCase = new CreateSubTaskUseCase();
        vi.clearAllMocks();
    });

    it('Should call subTaskAPI.create with provided data and return the result', async () => {
        const taskId = '1';
        const mockData: CreateSubTaskDTO = {
            text: 'Test subtask',
            position: 1,
        };

        const mockResponse: subTaskApiResponse = {
            id: '1',
            task_id: '1',
            text: 'Test subtask',
            completed: false,
            position: 1,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
        };

        const fullResponse = {
            data: mockResponse,
            status: 201,
            statusText: 'Created',
            headers: {},
            config: { headers: {} as any },
        };

        mockCreate.mockResolvedValue(fullResponse as any);

        const result = await createSubTaskUseCase.execute(taskId, mockData);

        expect(mockCreate).toHaveBeenCalledWith(taskId, mockData);
        expect(result).toEqual(mockResponse);
    });

    it('Should handle create subtask without position', async () => {
        const taskId = '2';
        const mockData: CreateSubTaskDTO = {
            text: 'Another subtask',
        };

        const mockResponse: subTaskApiResponse = {
            id: '2',
            task_id: '2',
            text: 'Another subtask',
            completed: false,
            position: 0,
            created_at: '2023-01-01T00:00:00Z',
        };

        const fullResponse = {
            data: mockResponse,
            status: 201,
            statusText: 'Created',
            headers: {},
            config: { headers: {} as any },
        };

        mockCreate.mockResolvedValue(fullResponse as any);

        const result = await createSubTaskUseCase.execute(taskId, mockData);

        expect(mockCreate).toHaveBeenCalledWith(taskId, mockData);
        expect(result).toEqual(mockResponse);
    });
})