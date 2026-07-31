import { MilestoneAPI } from "@/InfraStructure/api/milestones.api";
import type {
    CreateMilestoneDTO,
    UpdateMilestoneDTO,
    DeleteMilestoneDTO,
} from "@/domain/entities/milestones.dto";

interface UseCaseSuccess<T = any> {
    success: true;
    data: T;
    message: string;
}

interface UseCaseError {
    success: false;
    error: any;
    message: string;
}

type UseCaseResult<T = any> = UseCaseSuccess<T> | UseCaseError;

export class AddMilestoneToGoalUseCase {
    async execute(goalId: string, data: CreateMilestoneDTO): Promise<UseCaseResult> {
        try {
            const response = await MilestoneAPI.addToGoal(goalId, data);
            return {
                success: true,
                data: response.data,
                message: "Milestone added successfully"
            };
        } catch (error: any) {
            console.error('=== AddMilestoneToGoalUseCase Error ===', error);
            const errorData = error.response?.data;
            return {
                success: false,
                error: error,
                message: errorData?.message || error.message || "Failed to add milestone"
            };
        }
    }
}

export class UpdateMilestoneUseCase {
    async execute(goalId: string, milestoneId: string, data: Partial<UpdateMilestoneDTO>): Promise<UseCaseResult> {
        try {
            const response = await MilestoneAPI.update(goalId, milestoneId, data);
            return {
                success: true,
                data: response.data,
                message: "Milestone updated successfully"
            };
        } catch (error: any) {
            console.error('=== UpdateMilestoneUseCase Error ===', error);
            const errorData = error.response?.data;
            return {
                success: false,
                error: error,
                message: errorData?.message || error.message || "Failed to update milestone"
            };
        }
    }
}

export class DeleteMilestoneUseCase {
    async execute(params: DeleteMilestoneDTO): Promise<UseCaseResult> {
        try {
            await MilestoneAPI.delete(params);
            return {
                success: true,
                data: null,
                message: "Milestone deleted successfully"
            };
        } catch (error: any) {
            console.error('=== DeleteMilestoneUseCase Error ===', error);
            const errorData = error.response?.data;
            return {
                success: false,
                error: error,
                message: errorData?.message || error.message || "Failed to delete milestone"
            };
        }
    }
}
