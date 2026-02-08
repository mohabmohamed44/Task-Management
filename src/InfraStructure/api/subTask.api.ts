import {api} from "@/InfraStructure/api/http";
import type { subTask } from "@/domain/entities/subTask.dto";
import type { subTaskApiResponse } from "@/domain/entities/subTask-api.response";

export const subTaskAPI = {
    // Create a new subtask for a specific task
    create: (taskId: string, data: subTask) => api.post(`/tasks/${Number(taskId)}/subtasks`, data),
    
    // Update a specific subtask
    update: (taskId: string, subTaskId: string, data: Partial<subTask>) => 
        api.put(`/tasks/${taskId}/subtasks/${subTaskId}`, data),
    
    // Delete a specific subtask
    delete: (taskId: string, subTaskId: string) => 
        api.delete(`/tasks/${taskId}/subtasks/${subTaskId}`),
    
    // Get all subtasks for a specific task
    getSubTasks: (taskId: string) => api.get<subTaskApiResponse[]>(`/tasks/${taskId}/subtasks`),
    
    // Get a specific subtask
    getSubTask: (taskId: string, subTaskId: string) => 
        api.get<subTaskApiResponse>(`/tasks/${taskId}/subtasks/${subTaskId}`),
}