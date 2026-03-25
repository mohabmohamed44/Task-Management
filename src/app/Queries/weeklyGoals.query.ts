import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CreateGoalUseCase,
    GetCurrentWeekGoalsUseCase,
    GetGoalsBySpecificWeekUseCase,
    GetGoalByIdUseCase,
    UpdateGoalUseCase,
    DeleteGoalUseCase,
    ReOrderGoalPositionUseCase,
    DuplicateGoalToNextWeekUseCase,
    AddMilestoneToGoalUseCase,
    AddMilestoneUseCase,
    UpdateMilestoneUseCase,
    DeleteMilestoneUseCase,
    LinkGoalToTaskUseCase,
    UnlinkTaskFromGoalUseCase,
    GetWeeklyStatisticsUseCase
} from "@/domain/usecases/weeklyGoals.usecases";
import type {
    CreateGoal,
    GetGoalsBySpecificWeek,
    GetGoalById,
    updateGoal,
    DeleteGoal,
    reOrderGoalPosition,
    DuplicateGoalToNextWeek,
    addMilestoneToGoal,
    addMilestone,
    UpdateMilestone,
    DeleteMilestone,
    linkGoalToTask,
    UnlinkTaskFromGoal,
    GetWeeklyStatistics
} from "@/domain/entities/WeeklyGoals";
import toast from "react-hot-toast";

// Query Keys
export const weeklyGoalsQueryKeys = {
    goals: () => ["weekly-goals"] as const,
    currentWeek: () => ["weekly-goals", "current-week"] as const,
    week: (params: GetGoalsBySpecificWeek) => ["weekly-goals", "week", params.week_start.toISOString(), params.week_end.toISOString()] as const,
    goal: (goalId: string) => ["weekly-goals", goalId] as const,
    statistics: (params: GetWeeklyStatistics) => ["weekly-goals", "statistics", params.week_start.toISOString(), params.week_end.toISOString()] as const,
};

// Queries
export const useCurrentWeekGoalsQuery = () => {
    return useQuery({
        queryKey: weeklyGoalsQueryKeys.currentWeek(),
        queryFn: async () => {
            const useCase = new GetCurrentWeekGoalsUseCase();
            return useCase.execute();
        },
    });
};

export const useGoalsBySpecificWeekQuery = (params: GetGoalsBySpecificWeek) => {
    return useQuery({
        queryKey: weeklyGoalsQueryKeys.week(params),
        queryFn: async () => {
            const useCase = new GetGoalsBySpecificWeekUseCase();
            return useCase.execute(params);
        },
    });
};

export const useGoalByIdQuery = (params: GetGoalById) => {
    return useQuery({
        queryKey: weeklyGoalsQueryKeys.goal(params.goalId),
        queryFn: async () => {
            const useCase = new GetGoalByIdUseCase();
            return useCase.execute(params);
        },
        enabled: !!params.goalId,
    });
};

export const useWeeklyStatisticsQuery = (_params: GetWeeklyStatistics) => {
    return useQuery({
        queryKey: weeklyGoalsQueryKeys.statistics(_params),
        queryFn: async () => {
            const useCase = new GetWeeklyStatisticsUseCase();
            return useCase.execute();
        },
    });
};

// Goal Mutations
export const useCreateGoalMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateGoal) => {
            const useCase = new CreateGoalUseCase();
            const result = await useCase.execute(data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goals() });
            toast.success("Goal created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create goal");
        },
    });
};

export const useUpdateGoalMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ goalId, data }: { goalId: string; data: Partial<updateGoal> }) => {
            const useCase = new UpdateGoalUseCase();
            const result = await useCase.execute(goalId, data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: (_, { goalId }) => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goal(goalId) });
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goals() });
            toast.success("Goal updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update goal");
        },
    });
};

export const useDeleteGoalMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: DeleteGoal) => {
            const useCase = new DeleteGoalUseCase();
            const result = await useCase.execute(params);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: (_, { goalId }) => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goals() });
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goal(goalId) });
            toast.success("Goal deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete goal");
        },
    });
};

export const useReOrderGoalPositionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ goalId, data }: { goalId: string; data: reOrderGoalPosition }) => {
            const useCase = new ReOrderGoalPositionUseCase();
            const result = await useCase.execute(goalId, data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goals() });
            toast.success("Goal reordered successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to reorder goal");
        },
    });
};

export const useDuplicateGoalToNextWeekMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: DuplicateGoalToNextWeek) => {
            const useCase = new DuplicateGoalToNextWeekUseCase();
            const result = await useCase.execute(params);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goals() });
            toast.success("Goal duplicated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to duplicate goal");
        },
    });
};

// Milestone Mutations
export const useAddMilestoneToGoalMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ goalId, data }: { goalId: string; data: addMilestoneToGoal }) => {
            const useCase = new AddMilestoneToGoalUseCase();
            const result = await useCase.execute(goalId, data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: (_, { goalId }) => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goal(goalId) });
            toast.success("Milestone added successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to add milestone");
        },
    });
};

export const useAddMilestoneMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: addMilestone) => {
            const useCase = new AddMilestoneUseCase();
            const result = await useCase.execute(data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: (_, { goalId }) => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goal(goalId) });
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
        mutationFn: async ({ milestoneId, data }: { milestoneId: string; data: Partial<UpdateMilestone> }) => {
            const useCase = new UpdateMilestoneUseCase();
            const result = await useCase.execute(milestoneId, data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goals() });
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
        mutationFn: async (params: DeleteMilestone) => {
            const useCase = new DeleteMilestoneUseCase();
            const result = await useCase.execute(params);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goals() });
            toast.success("Milestone deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete milestone");
        },
    });
};

// Task-Goal Linking Mutations
export const useLinkGoalToTaskMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ goalId, params }: { goalId: string; params: linkGoalToTask }) => {
            const useCase = new LinkGoalToTaskUseCase();
            const result = await useCase.execute(goalId, params);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: (_, { goalId }) => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goal(goalId) });
            toast.success("Goal linked to task successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to link goal to task");
        },
    });
};

export const useUnlinkTaskFromGoalMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: UnlinkTaskFromGoal) => {
            const useCase = new UnlinkTaskFromGoalUseCase();
            const result = await useCase.execute(params);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result.data;
        },
        onSuccess: (_, { goalId }) => {
            queryClient.invalidateQueries({ queryKey: weeklyGoalsQueryKeys.goal(goalId) });
            toast.success("Task unlinked from goal successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to unlink task from goal");
        },
    });
};