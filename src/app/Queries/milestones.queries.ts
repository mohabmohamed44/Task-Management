import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    AddMilestoneToGoalUseCase,
    UpdateMilestoneUseCase,
    DeleteMilestoneUseCase,
} from "@/domain/usecases/milestones.usecases";
import type {
    CreateMilestoneDTO,
    UpdateMilestoneDTO,
    DeleteMilestoneDTO,
} from "@/domain/entities/milestones.dto";
import { weeklyGoalsQueryKeys } from "@/app/Queries/weeklyGoals.query";
import toast from "react-hot-toast";

// Query Keys
export const milestonesQueryKeys = {
    all: () => ["milestones"] as const,
    byGoal: (goalId: string) => ["milestones", goalId] as const,
};

// Milestone Mutations
export const useAddMilestoneToGoalMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ goalId, data }: { goalId: string; data: CreateMilestoneDTO }) => {
            const useCase = new AddMilestoneToGoalUseCase();
            const result = await useCase.execute(goalId, data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: (_, { goalId }) => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goal(String(goalId)) });
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goals() });
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.currentWeek() });
            toast.success("Milestone added successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to add milestone");
        },
    });
};

export const useUpdateMilestoneMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ goalId, milestoneId, data }: { goalId: string; milestoneId: string; data: Partial<UpdateMilestoneDTO> }) => {
            const useCase = new UpdateMilestoneUseCase();
            const result = await useCase.execute(goalId, milestoneId, data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: (_, { goalId }) => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goal(String(goalId)) });
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goals() });
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.currentWeek() });
            toast.success("Milestone updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update milestone");
        },
    });
};

export const useDeleteMilestoneMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: DeleteMilestoneDTO) => {
            const useCase = new DeleteMilestoneUseCase();
            const result = await useCase.execute(params);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goals() });
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.currentWeek() });
            toast.success("Milestone deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete milestone");
        },
    });
};
