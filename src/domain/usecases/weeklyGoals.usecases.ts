import { WeeklyGoalAPI } from "@/InfraStructure/api/weeklyGoal.api";
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
} from "@/domain/entities/WeeklyGoals";

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

// Goal Use Cases
export class CreateGoalUseCase {
    async execute(data: CreateGoal): Promise<UseCaseResult> {
        try {
            const response = await WeeklyGoalAPI.createGoal(data);
            return {
                success: true,
                data: response.data,
                message: "Goal created successfully"
            };
        } catch (error) {
            console.error('=== CreateGoalUseCase Error ===', error);
            return {
                success: false,
                error: error,
                message: "Failed to create goal"
            };
        }
    }
}

export class GetCurrentWeekGoalsUseCase {
    async execute() {
        try {
            const response = await WeeklyGoalAPI.getCurrentWeekGoals();
            return response.data;
        } catch (error) {
            console.error('=== GetCurrentWeekGoalsUseCase Error ===', error);
            throw error;
        }
    }
}

export class GetGoalsBySpecificWeekUseCase {
    async execute(params: GetGoalsBySpecificWeek) {
        try {
            const response = await WeeklyGoalAPI.getGoalsBySpecificWeek(params);
            return response.data;
        } catch (error) {
            console.error('=== GetGoalsBySpecificWeekUseCase Error ===', error);
            throw error;
        }
    }
}

export class GetGoalByIdUseCase {
    async execute(params: GetGoalById) {
        try {
            const response = await WeeklyGoalAPI.getGoalById(params);
            return response.data;
        } catch (error) {
            console.error('=== GetGoalByIdUseCase Error ===', error);
            throw error;
        }
    }
}

export class UpdateGoalUseCase {
    async execute(goalId: string, data: Partial<updateGoal>): Promise<UseCaseResult> {
        try {
            console.log('=== UpdateGoalUseCase Input ===', { goalId, data });
            const updates = { ...data };
            if (updates.status) {
                updates.status = updates.status.toLowerCase();
                if (updates.status === "pending") {
                    updates.status = "not_started";
                }
            }
            const response = await WeeklyGoalAPI.updateGoal(goalId, updates);
            console.log('=== UpdateGoalUseCase Success ===', response.data);
            console.log('=== UpdateGoalUseCase API Call ===', `PUT /weekly-goals/${goalId}/`);
            return {
                success: true,
                data: response.data,
                message: "Goal updated successfully"
            };
        } catch (error: any) {
            console.error('=== UpdateGoalUseCase Error ===', error);
            console.error('=== Error Response ===', error.response?.data);
            const errorData = error.response?.data;
            if (errorData?.errors) {
                console.error('=== Full Error Details ===', JSON.stringify(errorData.errors, null, 2));
            }
            return {
                success: false,
                error: error,
                message: errorData?.errors?.[0] || errorData?.message || "Failed to update goal"
            };
        }
    }
}

export class DeleteGoalUseCase {
    async execute(params: DeleteGoal): Promise<UseCaseResult> {
        try {
            await WeeklyGoalAPI.deleteGoal(params);
            return {
                success: true,
                data: null,
                message: "Goal deleted successfully"
            };
        } catch (error) {
            console.error('=== DeleteGoalUseCase Error ===', error);
            return {
                success: false,
                error: error,
                message: "Failed to delete goal"
            };
        }
    }
}

export class ReOrderGoalPositionUseCase {
    async execute(goalId: string, data: reOrderGoalPosition): Promise<UseCaseResult> {
        try {
            const response = await WeeklyGoalAPI.reOrderGoalPosition(goalId, data);
            return {
                success: true,
                data: response.data,
                message: "Goal reordered successfully"
            };
        } catch (error) {
            console.error('=== ReOrderGoalPositionUseCase Error ===', error);
            return {
                success: false,
                error: error,
                message: "Failed to reorder goal"
            };
        }
    }
}

export class DuplicateGoalToNextWeekUseCase {
    async execute(params: DuplicateGoalToNextWeek): Promise<UseCaseResult> {
        try {
            const response = await WeeklyGoalAPI.duplicateGoalToNextWeek(params);
            return {
                success: true,
                data: response.data,
                message: "Goal duplicated successfully"
            };
        } catch (error) {
            console.error('=== DuplicateGoalToNextWeekUseCase Error ===', error);
            return {
                success: false,
                error: error,
                message: "Failed to duplicate goal"
            };
        }
    }
}

// Milestone Use Cases
export class AddMilestoneToGoalUseCase {
    async execute(goalId: string, data: addMilestoneToGoal): Promise<UseCaseResult> {
        try {
            const response = await WeeklyGoalAPI.addMilestoneToGoal(goalId, data);
            return {
                success: true,
                data: response.data,
                message: "Milestone added successfully"
            };
        } catch (error) {
            console.error('=== AddMilestoneToGoalUseCase Error ===', error);
            return {
                success: false,
                error: error,
                message: "Failed to add milestone"
            };
        }
    }
}

export class AddMilestoneUseCase {
    async execute(data: addMilestone): Promise<UseCaseResult> {
        try {
            const response = await WeeklyGoalAPI.addMilestone(data);
            return {
                success: true,
                data: response.data,
                message: "Milestone added successfully"
            };
        } catch (error) {
            console.error('=== AddMilestoneUseCase Error ===', error);
            return {
                success: false,
                error: error,
                message: "Failed to add milestone"
            };
        }
    }
}

export class UpdateMilestoneUseCase {
    async execute(milestoneId: string, data: Partial<UpdateMilestone>): Promise<UseCaseResult> {
        try {
            const response = await WeeklyGoalAPI.updateMilestone(milestoneId, data);
            return {
                success: true,
                data: response.data,
                message: "Milestone updated successfully"
            };
        } catch (error) {
            console.error('=== UpdateMilestoneUseCase Error ===', error);
            return {
                success: false,
                error: error,
                message: "Failed to update milestone"
            };
        }
    }
}

export class DeleteMilestoneUseCase {
    async execute(params: DeleteMilestone): Promise<UseCaseResult> {
        try {
            await WeeklyGoalAPI.deleteMilestone(params);
            return {
                success: true,
                data: null,
                message: "Milestone deleted successfully"
            };
        } catch (error) {
            console.error('=== DeleteMilestoneUseCase Error ===', error);
            return {
                success: false,
                error: error,
                message: "Failed to delete milestone"
            };
        }
    }
}

// Task-Goal Linking Use Cases
export class LinkGoalToTaskUseCase {
    async execute(goalId: string, params: linkGoalToTask): Promise<UseCaseResult> {
        try {
            const response = await WeeklyGoalAPI.linkGoalToTask(goalId, params);
            return {
                success: true,
                data: response.data,
                message: "Goal linked to task successfully"
            };
        } catch (error) {
            console.error('=== LinkGoalToTaskUseCase Error ===', error);
            return {
                success: false,
                error: error,
                message: "Failed to link goal to task"
            };
        }
    }
}

export class UnlinkTaskFromGoalUseCase {
    async execute(params: UnlinkTaskFromGoal): Promise<UseCaseResult> {
        try {
            await WeeklyGoalAPI.unlinkTaskFromGoal(params);
            return {
                success: true,
                data: null,
                message: "Task unlinked from goal successfully"
            };
        } catch (error) {
            console.error('=== UnlinkTaskFromGoalUseCase Error ===', error);
            return {
                success: false,
                error: error,
                message: "Failed to unlink task from goal"
            };
        }
    }
}

// Statistics Use Cases
export class GetWeeklyStatisticsUseCase {
    async execute() {
        try {
            const response = await WeeklyGoalAPI.getWeeklyStatistics();
            return response.data;
        } catch (error) {
            console.error('=== GetWeeklyStatisticsUseCase Error ===', error);
            throw error;
        }
    }
}
