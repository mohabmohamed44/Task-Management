import { beforeEach, it, vi, expect, describe } from 'vitest';
import { DeleteSubTaskUseCase } from '../subtask.usecases';
import { subTaskAPI } from "@/InfraStructure/api/subTask.api";


vi.mock("@/InfraStructure/api/subTask.api", () => ({
    subTaskAPI: {
        delete: vi.fn()
    }
}));

describe('DeleteSubTaskUseCase', () => {
    let deleteSubTaskUseCase: DeleteSubTaskUseCase;
    const mockDelete = vi.mocked(subTaskAPI.delete);

    beforeEach(() => {
        deleteSubTaskUseCase = new DeleteSubTaskUseCase();
        vi.clearAllMocks();
    });

    it('Should call subTaskApi.delete with taskId and subTaskId', async () => {
        const taskId = '1';
        const subTaskId = '1';

        const fullResponse = {
            data: undefined,
            status: 204,
            statusText: 'No Content',
            headers: {},
            config: { headers: {} as any },
        };

        mockDelete.mockResolvedValue(fullResponse as any);
        await deleteSubTaskUseCase.execute(taskId, subTaskId);
        expect(mockDelete).toHaveBeenCalledWith(taskId, subTaskId);
    });
});