import { describe, it, expect } from 'vitest';
import { mapTaskFromApi } from '../task.mapper';
import type { TaskApiResponse } from '@/domain/entities/task-api.response';
import type { Task } from '@/domain/entities/task.entity';
import { TaskPriority } from '@/domain/enums/task-priority.enum';

describe('mapTaskFromApi', () => {
  it('maps TaskApiResponse to Task correctly', () => {
    const apiResponse: TaskApiResponse = {
      id: 1,
      userId: 1,
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      priority: TaskPriority.Medium,
      category: 'Work',
      due_date: '2023-12-31',
      tags: ['urgent'],
      isDeleted: false,
      deletedAt: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    };

    const result: Task = mapTaskFromApi(apiResponse);

    expect(result).toEqual({
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      priority: TaskPriority.Medium,
      category: 'Work',
      dueDate: new Date('2023-12-31'),
      tags: ['urgent'],
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-02T00:00:00Z'),
    });
  });

  it('handles null due_date', () => {
    const apiResponse: TaskApiResponse = {
      id: 2,
      userId: 1,
      title: 'Task without due date',
      description: 'No due date',
      completed: true,
      priority: TaskPriority.Low,
      category: 'Personal',
      due_date: null,
      tags: [],
      isDeleted: false,
      deletedAt: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    };

    const result: Task = mapTaskFromApi(apiResponse);

    expect(result.dueDate).toBeNull();
  });

  it('handles undefined tags', () => {
    const apiResponse: TaskApiResponse = {
      id: 3,
      userId: 1,
      title: 'Task with undefined tags',
      description: 'Tags undefined',
      completed: false,
      priority: TaskPriority.High,
      category: 'Work',
      due_date: '2023-12-31',
      tags: undefined as any,
      isDeleted: false,
      deletedAt: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    };

    const result: Task = mapTaskFromApi(apiResponse);

    expect(result.tags).toEqual([]);
  });

  it('parses dates correctly', () => {
    const apiResponse: TaskApiResponse = {
      id: 4,
      userId: 1,
      title: 'Date Test',
      description: 'Test dates',
      completed: true,
      priority: TaskPriority.High,
      category: 'Test',
      due_date: '2024-06-15',
      tags: ['test'],
      isDeleted: false,
      deletedAt: null,
      created_at: '2024-01-01T12:00:00Z',
      updated_at: '2024-01-02T13:00:00Z',
    };

    const result: Task = mapTaskFromApi(apiResponse);

    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.dueDate).toBeInstanceOf(Date);
    expect(result.createdAt.toISOString()).toBe('2024-01-01T12:00:00.000Z');
    expect(result.updatedAt.toISOString()).toBe('2024-01-02T13:00:00.000Z');
  });
});