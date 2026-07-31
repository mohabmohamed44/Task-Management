import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MilestoneAPI } from '../milestones.api';
import type {
    CreateMilestoneDTO,
    UpdateMilestoneDTO,
    DeleteMilestoneDTO,
} from '@/domain/entities/milestones.dto';

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

describe('MilestoneAPI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addToGoal', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const goalId = '1';
            const mockData: CreateMilestoneDTO = {
                title: 'New Milestone',
            };

            const fullResponse = {
                data: { id: 1, title: 'New Milestone' },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await MilestoneAPI.addToGoal(goalId, mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith(`/weekly-goals/${goalId}/milestones`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('update', () => {
        it('Should call api.put with correct URL and data, and return the response', async () => {
            const goalId = '1';
            const milestoneId = '1';
            const mockData: Partial<UpdateMilestoneDTO> = {
                title: 'Updated Milestone',
                completed: true,
            };

            const fullResponse = {
                data: { id: 1, ...mockData },
                status: 200,
            };

            apiClientMock.put.mockResolvedValueOnce(fullResponse);

            const result = await MilestoneAPI.update(goalId, milestoneId, mockData);

            expect(apiClientMock.put).toHaveBeenCalledWith(`/weekly-goals/${goalId}/milestones/${milestoneId}`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('delete', () => {
        it('Should call api.delete with correct URL and return the response', async () => {
            const params: DeleteMilestoneDTO = {
                goalId: 1,
                milestoneId: 2,
            };

            const fullResponse = {
                data: { message: 'Milestone deleted' },
                status: 200,
            };

            apiClientMock.delete.mockResolvedValueOnce(fullResponse);

            const result = await MilestoneAPI.delete(params);

            expect(apiClientMock.delete).toHaveBeenCalledWith(`/weekly-goals/${params.goalId}/milestones/${params.milestoneId}`);
            expect(result).toEqual(fullResponse);
        });
    });
});
