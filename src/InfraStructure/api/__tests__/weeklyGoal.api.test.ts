import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeeklyGoalAPI } from '../weeklyGoal.api';
import type {
    CreateGoal,
    addMilestoneToGoal,
    addMilestone,
    reOrderGoalPosition,
    updateGoal,
    UpdateMilestone,
    GetGoalsBySpecificWeek,
    GetGoalById,
    DeleteGoal,
    DeleteMilestone,
    DuplicateGoalToNextWeek,
    UnlinkTaskFromGoal,
    linkGoalToTask
} from '@/domain/entities/WeeklyGoals';
import { TaskPriority } from '@/domain/enums/task-priority.enum';

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

describe('WeeklyGoalAPI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createGoal', () => {
        it('Should call api.post with correct URL and formatted data, and return the response', async () => {
            const weekStart = new Date('2026-06-01');
            const weekEnd = new Date('2026-06-07');
            const mockData: CreateGoal = {
                title: 'Test Goal',
                description: 'A test goal',
                priority: TaskPriority.Medium,
                category: 'work',
                week_start: weekStart,
                week_end: weekEnd,
            };

            const expectedPayload = {
                title: mockData.title,
                description: mockData.description,
                priority: mockData.priority,
                category: mockData.category,
                weekStart: '2026-06-01',
                weekEnd: '2026-06-07',
            };

            const fullResponse = {
                data: { id: 1, ...expectedPayload },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.createGoal(mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith('/weekly-goals/', expectedPayload);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getCurrentWeekGoals', () => {
        it('Should call api.get with correct URL and return the response', async () => {
            const fullResponse = {
                data: [{ id: 1, title: 'Goal 1' }, { id: 2, title: 'Goal 2' }],
                status: 200,
            };

            apiClientMock.get.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.getCurrentWeekGoals();

            expect(apiClientMock.get).toHaveBeenCalledWith('/weekly-goals/current');
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getGoalsBySpecificWeek', () => {
        it('Should call api.get with correct URL and params, and return the response', async () => {
            const params: GetGoalsBySpecificWeek = {
                week_start: new Date('2026-06-01'),
                week_end: new Date('2026-06-07'),
            };

            const fullResponse = {
                data: [{ id: 1, title: 'Goal 1' }],
                status: 200,
            };

            apiClientMock.get.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.getGoalsBySpecificWeek(params);

            expect(apiClientMock.get).toHaveBeenCalledWith('/weekly-goals/by-week', {
                params: { weekStart: '2026-06-01' },
            });
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getGoalById', () => {
        it('Should call api.get with correct URL and return the response', async () => {
            const params: GetGoalById = {
                goalId: '1',
            };

            const fullResponse = {
                data: { id: 1, title: 'Test Goal' },
                status: 200,
            };

            apiClientMock.get.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.getGoalById(params);

            expect(apiClientMock.get).toHaveBeenCalledWith(`/weekly-goals/${params.goalId}`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('updateGoal', () => {
        it('Should call api.put with correct URL and data, and return the response', async () => {
            const goalId = '1';
            const mockData: Partial<updateGoal> = {
                title: 'Updated Goal',
                status: 'in_progress',
                progress: 50,
            };

            const fullResponse = {
                data: { id: 1, ...mockData },
                status: 200,
            };

            apiClientMock.put.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.updateGoal(goalId, mockData);

            expect(apiClientMock.put).toHaveBeenCalledWith(`/weekly-goals/${goalId}`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('deleteGoal', () => {
        it('Should call api.delete with correct URL and return the response', async () => {
            const params: DeleteGoal = {
                goalId: '1',
            };

            const fullResponse = {
                data: { message: 'Goal deleted' },
                status: 200,
            };

            apiClientMock.delete.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.deleteGoal(params);

            expect(apiClientMock.delete).toHaveBeenCalledWith(`/weekly-goals/${params.goalId}`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('reOrderGoalPosition', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const goalId = '1';
            const mockData: reOrderGoalPosition = {
                weekStart: new Date('2026-06-01'),
                newPosition: '2',
            };

            const fullResponse = {
                data: { id: 1, position: '2' },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.reOrderGoalPosition(goalId, mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith(`/weekly-goals/${goalId}/reorder`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('duplicateGoalToNextWeek', () => {
        it('Should call api.post with correct URL and formatted data, and return the response', async () => {
            const params: DuplicateGoalToNextWeek = {
                goalId: '1',
                newWeekStart: new Date('2026-06-08'),
                newWeekEnd: new Date('2026-06-14'),
            };

            const expectedPayload = {
                newWeekStart: '2026-06-08',
                newWeekEnd: '2026-06-14',
            };

            const fullResponse = {
                data: { id: 2, title: 'Duplicated Goal' },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.duplicateGoalToNextWeek(params);

            expect(apiClientMock.post).toHaveBeenCalledWith(`/weekly-goals/${params.goalId}/duplicate`, expectedPayload);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('addMilestone', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const mockData: addMilestone = {
                goalId: '1',
                title: 'New Milestone',
            };

            const fullResponse = {
                data: { id: 1, title: 'New Milestone' },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.addMilestone(mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith(`/weekly-goals/${mockData.goalId}/milestones`, { title: mockData.title });
            expect(result).toEqual(fullResponse);
        });
    });

    describe('addMilestoneToGoal', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const goalId = '1';
            const mockData: addMilestoneToGoal = {
                title: 'New Milestone',
            };

            const fullResponse = {
                data: { id: 1, title: 'New Milestone' },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.addMilestoneToGoal(goalId, mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith(`/weekly-goals/${goalId}/milestones`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('updateMilestone', () => {
        it('Should call api.put with correct URL and data, and return the response', async () => {
            const milestoneId = '1';
            const mockData: Partial<UpdateMilestone> = {
                title: 'Updated Milestone',
                status: 'completed',
            };

            const fullResponse = {
                data: { id: 1, ...mockData },
                status: 200,
            };

            apiClientMock.put.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.updateMilestone(milestoneId, mockData);

            expect(apiClientMock.put).toHaveBeenCalledWith(`/weekly-goals/milestones/${milestoneId}`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('deleteMilestone', () => {
        it('Should call api.delete with correct URL and return the response', async () => {
            const params: DeleteMilestone = {
                milestoneId: '1',
            };

            const fullResponse = {
                data: { message: 'Milestone deleted' },
                status: 200,
            };

            apiClientMock.delete.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.deleteMilestone(params);

            expect(apiClientMock.delete).toHaveBeenCalledWith(`/weekly-goals/milestones/${params.milestoneId}`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('linkGoalToTask', () => {
        it('Should call api.post with correct URL and params, and return the response', async () => {
            const goalId = '1';
            const params: linkGoalToTask = {
                goalId: '1',
            };

            const fullResponse = {
                data: { message: 'Task linked' },
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.linkGoalToTask(goalId, params);

            expect(apiClientMock.post).toHaveBeenCalledWith(`/weekly-goals/${goalId}/link-task`, params);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('unlinkTaskFromGoal', () => {
        it('Should call api.delete with correct URL and return the response', async () => {
            const params: UnlinkTaskFromGoal = {
                goalId: '1',
                taskId: '2',
            };

            const fullResponse = {
                data: { message: 'Task unlinked' },
                status: 200,
            };

            apiClientMock.delete.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.unlinkTaskFromGoal(params);

            expect(apiClientMock.delete).toHaveBeenCalledWith(`/weekly-goals/${params.goalId}/tasks/${params.taskId}`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getWeeklyStatistics', () => {
        it('Should call api.get with correct URL and return the response', async () => {
            const fullResponse = {
                data: { totalGoals: 5, completedGoals: 3 },
                status: 200,
            };

            apiClientMock.get.mockResolvedValueOnce(fullResponse);

            const result = await WeeklyGoalAPI.getWeeklyStatistics();

            expect(apiClientMock.get).toHaveBeenCalledWith('/weekly-goals/stats');
            expect(result).toEqual(fullResponse);
        });
    });
});