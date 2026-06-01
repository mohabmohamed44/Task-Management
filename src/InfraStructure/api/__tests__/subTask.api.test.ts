import { describe, it, expect, vi, beforeEach } from 'vitest';
import { subTaskAPI } from '../subTask.api';
import type { subTask } from '@/domain/entities/subTask.dto';
import type { subTaskApiResponse } from '@/domain/entities/subTask-api.response';

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

describe('subTaskAPI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('create', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const taskId = '1';
            const mockData: subTask = {
                text: 'Test SubTask',
                completed: false,
            };
            const mockResponse: subTaskApiResponse = {
                id: 1,
                task_id: Number(taskId),
                position: 1,
                created_at: new Date().toISOString(),
                text: 'Test SubTask',
                completed: false,
            };
            const fullResponse = {
                data: mockResponse,
                status: 200,
            };
            
            apiClientMock.post.mockResolvedValueOnce(fullResponse);
            
            const result = await subTaskAPI.create(taskId, mockData);
            
            expect(apiClientMock.post).toHaveBeenCalledWith(`/tasks/${Number(taskId)}/subtasks`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });
    
    // Additional tests for update, delete, getSubTasks, and getSubTask can be added similarly

    describe('update', () => {
        it('Should call api.put with correct URL and data, and return the response', async () => {
            const taskId = '1';
            const subTaskId = '1';
            const mockData: Partial<subTask> & { completed: boolean } = {
                text: 'Updated SubTask',
                completed: true,
            };
            const mockResponse: subTaskApiResponse = {
                id: Number(subTaskId),
                task_id: Number(taskId),
                position: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                text: 'Updated SubTask',
                completed: true,
            };
            const fullResponse = {
                data: mockResponse,
                status: 200,
            };
            
            apiClientMock.put.mockResolvedValueOnce(fullResponse);
            
            const result = await subTaskAPI.update(taskId, subTaskId, mockData);
            
            expect(apiClientMock.put).toHaveBeenCalledWith(`/tasks/${Number(taskId)}/subtasks/${Number(subTaskId)}`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });
    
    describe('delete', () => {
        it('Should call api.delete with correct URL and return the response', async () => {
            const taskId = '1';
            const subTaskId = '1';
            const fullResponse = {
                data: {},
                status: 200,
            };
            apiClientMock.delete.mockResolvedValueOnce(fullResponse);
            
            const result = await subTaskAPI.delete(taskId, subTaskId);
            
            expect(apiClientMock.delete).toHaveBeenCalledWith(`/tasks/${Number(taskId)}/subtasks/${Number(subTaskId)}`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getSubTasks', () => {
        it('Should call api.get with correct URL and return the response', async () => {
            const taskId = '1';
            const mockResponse: subTaskApiResponse[] = [
                {
                    id: 1,
                    task_id: Number(taskId),
                    position: 1,
                    created_at: new Date().toISOString(),
                    text: 'Test SubTask',
                    completed: false,
                },
            ];
            const fullResponse = {
                data: mockResponse,
                status: 200,
            };
            
            apiClientMock.get.mockResolvedValueOnce(fullResponse);
            
            const result = await subTaskAPI.getSubTasks(taskId);
            
            expect(apiClientMock.get).toHaveBeenCalledWith(`/tasks/${Number(taskId)}/subtasks`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('getSubTask', () => {
        it('Should call api.get with correct URL and return the response', async () => {
            const taskId = '1';
            const subTaskId = '1';
            const mockResponse: subTaskApiResponse = {
                id: Number(subTaskId),
                task_id: Number(taskId),
                position: 1,
                created_at: new Date().toISOString(),
                text: 'Test SubTask',
                completed: false,
            };
            const fullResponse = {
                data: mockResponse,
                status: 200,
            };
            
            apiClientMock.get.mockResolvedValueOnce(fullResponse);
            
            const result = await subTaskAPI.getSubTask(taskId, subTaskId);
            
            expect(apiClientMock.get).toHaveBeenCalledWith(`/tasks/${Number(taskId)}/subtasks/${Number(subTaskId)}`);
            expect(result).toEqual(fullResponse);
        }); 
    });
});