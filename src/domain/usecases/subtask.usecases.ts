import { subTaskAPI } from "@/InfraStructure/api/subTask.api";
import type { CreateSubTaskDTO, UpdateSubTaskDTO } from "@/domain/entities/subTask.dto";
import type { subTaskApiResponse } from "@/domain/entities/subTask-api.response";

export class CreateSubTaskUseCase {
    async execute(taskId: string, data: CreateSubTaskDTO): Promise<subTaskApiResponse> {
        try {
            console.log('=== CreateSubTaskUseCase ===');
            console.log('TaskId:', taskId);
            console.log('Data being sent:', JSON.stringify(data, null, 2));
            const res = await subTaskAPI.create(taskId, data);
            console.log('Subtask created successfully:', res.data);
            return res.data;
        } catch (error) {
            console.error('=== CreateSubTaskUseCase Error ===');
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

export class GetSubTasksUseCase {
    async execute(taskId: string): Promise<subTaskApiResponse[]> {
        try {
            const res = await subTaskAPI.getSubTasks(taskId);
            console.log('Subtasks retrieved successfully:', res.data);
            return res.data;
        } catch (error) {
            console.error('=== GetSubTasksUseCase Error ===');
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

export class GetSubTaskByIdUseCase {
    async execute(taskId: string, subTaskId: string): Promise<subTaskApiResponse> {
        try {
            const res = await subTaskAPI.getSubTask(taskId, subTaskId);
            console.log('Subtask retrieved successfully:', res.data);
            return res.data;
        } catch (error) {
            console.error('=== GetSubTaskByIdUseCase Error ===');
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

export class UpdateSubTaskUseCase {
    async execute(taskId: string, subTaskId: string, data: UpdateSubTaskDTO): Promise<subTaskApiResponse> {
        try {
            const res = await subTaskAPI.update(taskId, subTaskId, data);
            console.log('Subtask updated successfully:', res.data);
            return res.data;
        } catch (error) {
            console.error('=== UpdateSubTaskUseCase Error ===');
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

export class DeleteSubTaskUseCase {
    async execute(taskId: string, subTaskId: string): Promise<void> {
        try {
            await subTaskAPI.delete(taskId, subTaskId);
            console.log('Subtask deleted successfully');
        } catch (error) {
            console.error('=== DeleteSubTaskUseCase Error ===');
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

