import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTaskUseCase } from '../task.usecases';
import { TaskAPI } from '@/InfraStructure/api/task.api';
import type { UpdateTaskDTO } from '@/domain/entities/task.dto';
import { TaskPriority } from '@/domain/enums/task-priority.enum';

// Mock TaskAPI
vi.mock('@/InfraStructure/api/task.api', () => ({
  TaskAPI: {
    updateTask: vi.fn(),
  },
}));

describe('UpdateTaskUseCase', () => {
  let updateTaskUseCase: UpdateTaskUseCase;
  const mockUpdateTask = vi.mocked(TaskAPI.updateTask);

  beforeEach(() => {
    updateTaskUseCase = new UpdateTaskUseCase();
    vi.clearAllMocks();
  });

  it('should call TaskAPI.updateTask with provided id and data and return the result', async () => {
    const taskId = '123';
    const mockData: UpdateTaskDTO = {
      title: 'Updated Task',
      description: 'Updated description',
      priority: TaskPriority.High,
      category: 'Updated Category',
      tags: ['updated'],
      completed: true,
    };
    const mockResponse = {
      data: { id: taskId, ...mockData },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as any },
    };
    mockUpdateTask.mockResolvedValue(mockResponse as any);

    const result = await updateTaskUseCase.execute(taskId, mockData);

    expect(mockUpdateTask).toHaveBeenCalledWith(taskId, mockData);
    expect(mockUpdateTask).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it('should handle partial update', async () => {
    const taskId = '456';
    const mockData: UpdateTaskDTO = {
      title: 'Partial Update',
      completed: false,
    };
    const mockResponse = {
      data: { id: taskId, title: 'Partial Update', completed: false },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as any },
    };
    mockUpdateTask.mockResolvedValue(mockResponse as any);

    const result = await updateTaskUseCase.execute(taskId, mockData);

    expect(mockUpdateTask).toHaveBeenCalledWith(taskId, mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should throw error on API failure', async () => {
    const taskId = '789';
    const mockData: UpdateTaskDTO = { title: 'Fail Task' };
    const mockError = new Error('Update failed');
    mockUpdateTask.mockRejectedValue(mockError);

    await expect(updateTaskUseCase.execute(taskId, mockData)).rejects.toThrow('Update failed');
    expect(mockUpdateTask).toHaveBeenCalledWith(taskId, mockData);
  });
});