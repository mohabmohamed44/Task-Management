import { beforeEach, it, vi, expect, describe } from 'vitest';
import { UpdateSubTaskUseCase } from '../subtask.usecases';
import type { UpdateSubTaskDTO } from '@/domain/entities/subTask.dto';
import type { subTaskApiResponse } from '@/domain/entities/subTask-api.response';
import { subTaskAPI } from '@/InfraStructure/api/subTask.api';

vi.mock("@/InfraStructure/api/subTask.api", () => ({
    subTaskAPI: {
        update: vi.fn(),
    },
}));

describe('UpdateSubTaskUseCase', () => {
    let updateSubTaskUseCase: UpdateSubTaskUseCase;
    const mockUpdate = vi.mocked(subTaskAPI.update);

    beforeEach(() => {
        updateSubTaskUseCase = new UpdateSubTaskUseCase();
        vi.clearAllMocks();
    });

    it('Should call subTaskAPI.update with provided data and return the result', async () => {
        const taskId = '1';
        const subTaskId = '1';

        const mockData: UpdateSubTaskDTO = {
            text: 'Updated subtask text',
            completed: true,
            position: 1,
        };

        const mockResponse: subTaskApiResponse = {
            id: subTaskId,
            task_id: taskId,
            text: mockData.text!,
            completed: mockData.completed!,
            position: mockData.position!,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
        };

        const fullResponse = {
            data: mockResponse,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {headers: {} as any},
        };

        mockUpdate.mockResolvedValue(fullResponse as any);

        const result = await updateSubTaskUseCase.execute(taskId, subTaskId, mockData);
    
        expect(mockUpdate).toHaveBeenCalledWith(taskId, subTaskId, mockData);
        expect(result).toEqual(mockResponse);
    });

    it('Should handle partial update (only text)', async () => {
        const taskId = '2';
        const subTaskId = '2';

        const mockData: UpdateSubTaskDTO = {
            text: 'Partially updated text',
        };

        const mockResponse: subTaskApiResponse = {
            id: subTaskId,
            task_id: taskId,
            text: 'Partially updated text',
            completed: false,
            position: 0,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
        };

        const fullResponse = {
            data: mockResponse,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { headers: {} as any },
        };

        mockUpdate.mockResolvedValue(fullResponse as any);

        const result = await updateSubTaskUseCase.execute(taskId, subTaskId, mockData);

        expect(mockUpdate).toHaveBeenCalledWith(taskId, subTaskId, mockData);
        expect(result).toEqual(mockResponse);
    });
})