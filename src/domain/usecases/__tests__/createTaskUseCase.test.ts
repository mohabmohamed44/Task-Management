import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTaskUseCase } from '../task.usecases';
import { TaskAPI } from '@/InfraStructure/api/task.api';
import type { CreateTaskDTO } from '@/domain/entities/task.dto';
import { TaskPriority } from '@/domain/enums/task-priority.enum';


// Mock TaskAPI
vi.mock('@/InfraStructure/api/task.api', () => ({
  TaskAPI: {
    createTask: vi.fn(),
  },
}));

describe('CreateTaskUseCase', () => {
    let createTaskUseCase: CreateTaskUseCase;
    const mockCreateTask = vi.mocked(TaskAPI.createTask);


    beforeEach(() => {
        createTaskUseCase = new CreateTaskUseCase();
        vi.clearAllMocks();
    })

    it('Should all TaskAPI.createTask with provided data and return the result', async () => {
        const mockData: CreateTaskDTO = {
            title: "Test task",
            description: "This is a test task",
            priority: TaskPriority.Medium,
            category: 'Work',
            tags: ['urgent', 'important'],
            dueDate: '2026-12-31',
        };

        const mockResponse = {
            data: { id: '1', ...mockData },
            status: 201,
            statusText: 'Created',
            headers: {},
            config: { headers: {} as any },
        };
        mockCreateTask.mockResolvedValue(mockResponse as any);
        
        const result = await createTaskUseCase.execute(mockData);
        
        expect(mockCreateTask).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(mockResponse);
    });

    it('Should handle create task without dueDate', async () => {
        const mockData: CreateTaskDTO = {
            title: 'Another Task',
            description: 'No due date',
            priority: TaskPriority.Low,
            category: 'Personal',
            tags: [],
        };
        
        const mockResponse = {
            data: { id: '2', ...mockData },
            status: 201,
            statusText: 'Created',
            headers: {},
            config: { headers: {} as any },
        };
        mockCreateTask.mockResolvedValue(mockResponse as any);
        
        const result = await createTaskUseCase.execute(mockData);
        
        expect(mockCreateTask).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(mockResponse);
    });
});