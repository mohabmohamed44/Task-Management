import { beforeEach, it, vi, describe, expect } from 'vitest';
import { subTaskAPI } from "@/InfraStructure/api/subTask.api";
import { GetSubTasksUseCase } from '../subtask.usecases';
import type { subTaskApiResponse } from '@/domain/entities/subTask-api.response';

vi.mock("@/InfraStructure/api/subTask.api", () => ({
    subTaskAPI: {
        getSubTasks: vi.fn(),
    }
}));


describe('GetSubTasksUseCase', () => {
    let getSubTaskUseCase: GetSubTasksUseCase;
    const mockGetSubTasks = vi.mocked(subTaskAPI.getSubTasks);

    beforeEach(() => {
        getSubTaskUseCase = new GetSubTasksUseCase();
        vi.clearAllMocks();
    });

    it('Should call SubTaskAPI.getSubtasks and return the result', async () => {
        const taskId = '1';
        const mockResponse: subTaskApiResponse[] = [
            {
                id: '1',
                task_id: '1',
                text: 'subTask 1',
                completed: false,
                position: 1,
                created_at: '2023-01-01T00:00:00Z',
                updated_at: '2023-01-01T00:00:00Z',
            }
        ];

        const fullResponse = {
            data: mockResponse,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {headers: {} as any}
        };

        mockGetSubTasks.mockResolvedValue(fullResponse as any);
        const result = await getSubTaskUseCase.execute(taskId as any);
        expect(mockGetSubTasks).toHaveBeenCalledWith(taskId);
        expect(result).toEqual(mockResponse);
    });
});