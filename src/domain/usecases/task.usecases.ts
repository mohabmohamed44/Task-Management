import { TaskAPI } from "@/InfraStructure/api/task.api";
import { mapTaskFromApi } from "@/InfraStructure/mappers/task.mapper";
import type { GetTaskQueryDTO } from "@/domain/entities/get-tasks-query.dto";
import type { CreateTaskDTO, UpdateTaskDTO } from "@/domain/entities/task.dto";
import type { Task } from "@/domain/entities/task.entity";
import type { PaginatedTasksApiResponse } from "@/domain/entities/task-api.response";


type TaskMeta = PaginatedTasksApiResponse["meta"];

export interface GetTaskResult {
    meta: TaskMeta;
    tasks: Task[];
}

export class GetTasksUseCase {
    async execute(query: GetTaskQueryDTO): Promise<GetTaskResult> {
        try {
            const res = await TaskAPI.getTasks(query);
            
            // Backend returns { tasks: [...] }
            if (res.data && 'tasks' in res.data && Array.isArray(res.data.tasks)) {
                const tasks = res.data.tasks;
                console.log('Found tasks array:', tasks);
                
                // Check if meta exists in the response
                if ('meta' in res.data) {
                    return {
                        meta: res.data.meta,
                        tasks: tasks.map(mapTaskFromApi),
                    }
                }

                return {
                    meta: {
                        page: query.page || 1,
                        limit: query.limit || tasks.length,
                        total: tasks.length,
                        totalPages: 1
                    },
                    tasks: tasks.map(mapTaskFromApi),
                }
            }
            
            // Fallback: if response has data and meta (original expected structure)
            if (res.data && 'data' in res.data && Array.isArray(res.data.data)) {
                return {
                    meta: res.data.meta,
                    tasks: res.data.data.map(mapTaskFromApi),
                }
            }
            
            throw new Error('Unexpected API response structure');
        } catch (error) {
            console.error('=== GetTasksUseCase Error ===');
            console.error('Error:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Response status:', axiosError.response?.status);
                console.error('Response data:', axiosError.response?.data);
            }
            throw error;
        }
    }
}

export class CreateTaskUseCase {
    async execute(data: CreateTaskDTO) {
        return TaskAPI.createTask(data);
    }
}

export class GetTaskByIdUseCase {
    async execute(id: string): Promise<Task> {
        try {
            const res = await TaskAPI.getTaskById(id);
            
            // Handle different potential response structures
            if (res.data) {
                // If data is directly the task object
                if ('id' in res.data && 'title' in res.data) {
                    return mapTaskFromApi(res.data);
                }
                // If data is wrapped in a 'data' property
                if ('data' in res.data && 'id' in res.data.data) {
                    return mapTaskFromApi(res.data.data);
                }
                 // If data is wrapped in a 'task' property
                if ('task' in res.data && 'id' in res.data.task) {
                    return mapTaskFromApi(res.data.task);
                }
            }
            
            throw new Error('Unexpected API response structure for GetTaskById');
        } catch (error) {
            console.error('=== GetTaskByIdUseCase Error ===');
            console.error('Error:', error);
            throw error;
        }
    }
}

export class UpdateTaskUseCase {
    async execute(id: string, data: UpdateTaskDTO) {
        try {
            return await TaskAPI.updateTask(id, data);
        } catch (error) {
            console.error('=== UpdateTaskUseCase Error ===');
            console.error('Error:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Response status:', axiosError.response?.status);
                console.error('Response data:', axiosError.response?.data);
            }
            throw error;
        }
    }
}

export class DeleteTaskUseCase {
  async execute(id: string) {
    try {
      return await TaskAPI.deleteTask(id);
    } catch (error) {
      console.error('=== DeleteTaskUseCase Error ===');
      console.error('Error:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Response status:', axiosError.response?.status);
        console.error('Response data:', axiosError.response?.data);
      }
      throw error;
    }
  }
}

export class GetUserStatsUseCase {
  async execute() {
    try {
      const response = await TaskAPI.getStats();
      return response.data;
    } catch (error) {
      console.error('=== GetUserStatsUseCase Error ===');
      console.error('Error:', error);
      throw error;
    }
  }
}