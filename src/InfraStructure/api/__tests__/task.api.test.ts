import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskAPI } from '../task.api';
import type { CreateTaskDTO } from '@/domain/entities/task.dto';
import type { GetTaskQueryDTO } from '@/domain/entities/get-tasks-query.dto';
import type { PaginatedTasksApiResponse, TaskApiResponse } from '@/domain/entities/task-api.response';
import type { UserStats } from '@/domain/entities/stats';
import type { getTaskHistory } from '@/domain/entities/task.entity';
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

describe('TaskAPI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createTask', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const mockData: CreateTaskDTO = {
                title: 'Test Task',
                description: 'This is a test task',
                priority: TaskPriority.Medium,
                category: 'work',
                dueDate: '2026-06-15',
                tags: ['frontend'],
            };

            const mockResponse: TaskApiResponse = {
                id: 1,
                userId: 1,
                title: 'Test Task',
                description: 'This is a test task',
                completed: false,
                priority: TaskPriority.Medium,
                category: 'work',
                due_date: '2026-06-15',
                isDeleted: false,
                deletedAt: null,
                created_at: '2026-06-01T00:00:00Z',
                updated_at: '2026-06-01T00:00:00Z',
                tags: ['frontend'],
            };

            const fullResponse = {
                data: mockResponse,
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await TaskAPI.createTask(mockData);

            expect(apiClientMock.post).toHaveBeenCalledWith('/tasks', mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getTasks', () => {
        it('Should call api.get with correct URL and params, and return the response', async () => {
            const mockParams: GetTaskQueryDTO = {
                page: 1,
                limit: 10,
                priority: TaskPriority.Medium,
            };

            const mockResponse: PaginatedTasksApiResponse = {
                data: [
                    {
                        id: 1,
                        userId: 1,
                        title: 'Test Task',
                        description: 'This is a test task',
                        completed: false,
                        priority: TaskPriority.Medium,
                        category: 'work',
                        due_date: null,
                        isDeleted: false,
                        deletedAt: null,
                        created_at: '2026-06-01T00:00:00Z',
                        updated_at: '2026-06-01T00:00:00Z',
                        tags: ['frontend'],
                    },
                ],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                },
            };

            const fullResponse = {
                data: mockResponse,
                status: 200,
            };

            apiClientMock.get.mockResolvedValueOnce(fullResponse);

            const result = await TaskAPI.getTasks(mockParams);
            expect(apiClientMock.get).toHaveBeenCalledWith('/tasks', { params: mockParams });
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getTaskById', () => {
        it('Should call api.get with correct URL and return the response', async () => {
            const taskId = '1';

            const mockResponse: TaskApiResponse = {
                id: 1,
                userId: 1,
                title: 'Test Task',
                description: 'This is a test task',
                completed: false,
                priority: TaskPriority.Medium,
                category: 'work',
                due_date: null,
                isDeleted: false,
                deletedAt: null,
                created_at: '2026-06-01T00:00:00Z',
                updated_at: '2026-06-01T00:00:00Z',
                tags: ['frontend'],
            };

            const fullResponse = {
                data: mockResponse,
                status: 200,
            };

            apiClientMock.get.mockResolvedValueOnce(fullResponse);

            const result = await TaskAPI.getTaskById(taskId);
            expect(apiClientMock.get).toHaveBeenCalledWith(`/tasks/${taskId}`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('updateTask', () => {
        it('Should call api.put with correct URL and data, and return the response', async () => {
            const taskId = '1';
            const mockData: Partial<CreateTaskDTO> & { completed: boolean } = {
                title: 'Updated Task',
                completed: true,
            };

            const mockResponse: TaskApiResponse = {
                id: 1,
                userId: 1,
                title: 'Updated Task',
                description: 'This is a test task',
                completed: true,
                priority: TaskPriority.Medium,
                category: 'work',
                due_date: null,
                isDeleted: false,
                deletedAt: null,
                created_at: '2026-06-01T00:00:00Z',
                updated_at: '2026-06-01T00:00:00Z',
                tags: ['frontend'],
            };

            const fullResponse = {
                data: mockResponse,
                status: 200,
            };

            apiClientMock.put.mockResolvedValueOnce(fullResponse);

            const result = await TaskAPI.updateTask(taskId, mockData);
            expect(apiClientMock.put).toHaveBeenCalledWith(`/tasks/${taskId}`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('deleteTask', () => {
        it('Should call api.delete with correct URL and return the response', async () => {
            const taskId = '1';

            const fullResponse = {
                data: { message: 'Task deleted successfully' },
                status: 200,
            };

            apiClientMock.delete.mockResolvedValueOnce(fullResponse);

            const result = await TaskAPI.deleteTask(taskId);
            expect(apiClientMock.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getStats', () => {
        it('Should call api.get with correct URL and return the response', async () => {
            const mockResponse: UserStats = {
                totalCompleted: 10,
                currentStreak: 3,
                longestStreak: 7,
                contributions: [
                    { date: '2026-06-01', count: 2 },
                    { date: '2026-05-31', count: 1 },
                ],
            };

            const fullResponse = {
                data: mockResponse,
                status: 200,
            };

            apiClientMock.get.mockResolvedValueOnce(fullResponse);

            const result = await TaskAPI.getStats();
            expect(apiClientMock.get).toHaveBeenCalledWith('/tasks/stats');
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getTaskHistory', () => {
        it('Should call api.get with correct URL and return the response', async () => {
            const taskId = '1';

            const mockResponse: getTaskHistory[] = [
                {
                    id: 1,
                    task_id: Number(taskId),
                    user_id: 1,
                    action: 'update',
                    field: 'status',
                    old_value: 'todo',
                    new_value: 'done',
                    created_at: '2026-06-01T00:00:00Z',
                    users: { name: 'Test User', email: 'test@example.com' },
                    userName: 'Test User',
                    userEmail: 'test@example.com',
                },
            ];

            const fullResponse = {
                data: mockResponse,
                status: 200,
            };

            apiClientMock.get.mockResolvedValueOnce(fullResponse);

            const result = await TaskAPI.getTaskHistory(taskId);
            expect(apiClientMock.get).toHaveBeenCalledWith(`/tasks/${taskId}/history`);
            expect(result).toEqual(fullResponse);
        });
    });
});