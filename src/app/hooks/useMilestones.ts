import { useMemo } from "react";
import { useCurrentWeekGoalsQuery, useGoalsBySpecificWeekQuery } from "@/app/Queries/weeklyGoals.query";
import {
  useAddMilestoneToGoalMutation,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
} from "@/app/Queries/milestones.queries";
import {
  getWeekDays,
  getCurrentWeekRange,
} from "@/presentation/Pages/WeeklyGoals/utils/dateHelpers";
import {
  calculateMilestoneStats,
  isMilestoneCompleted,
  type MilestoneStats,
} from "@/presentation/Pages/Milestones/utils/milestoneStats";
import type { Milestone } from "@/domain/entities/milestones.entity";

export interface UseMilestonesReturn {
  goals: any[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  weekDays: ReturnType<typeof getWeekDays>;
  stats: MilestoneStats;
  addMilestone: (goalId: string, data: { title: string }) => void;
  updateMilestone: (goalId: string, milestoneId: string, data: { title?: string; completed?: boolean }) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  toggleMilestone: (goalId: string, milestone: Milestone) => void;
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const useMilestones = (weekOffset: number): UseMilestonesReturn => {
  const { start: currentWeekStart, end: currentWeekEnd } = getCurrentWeekRange(weekOffset);

  const { data: selectedWeekGoals, isLoading, isError, refetch } = useGoalsBySpecificWeekQuery({
    week_start: currentWeekStart,
    week_end: currentWeekEnd,
  });

  const { data: actualCurrentWeekGoals, isLoading: isCurrentWeekLoading } = useCurrentWeekGoalsQuery();

  const addMilestoneMutation = useAddMilestoneToGoalMutation();
  const updateMilestoneMutation = useUpdateMilestoneMutation();
  const deleteMilestoneMutation = useDeleteMilestoneMutation();

  const weekDays = useMemo(
    () => getWeekDays(currentWeekStart),
    [currentWeekStart]
  );

  const goals = useMemo(() => {
    if (weekOffset === 0) {
      return actualCurrentWeekGoals || [];
    }
    return selectedWeekGoals || [];
  }, [selectedWeekGoals, actualCurrentWeekGoals, weekOffset]);

  const stats = useMemo(() => calculateMilestoneStats(goals), [goals]);

  const addMilestone = (goalId: string, data: { title: string }) => {
    addMilestoneMutation.mutate({ goalId, data });
  };

  const updateMilestone = (
    goalId: string,
    milestoneId: string,
    data: { title?: string; completed?: boolean }
  ) => {
    updateMilestoneMutation.mutate({ goalId, milestoneId, data });
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    deleteMilestoneMutation.mutate({ goalId, milestoneId });
  };

  const toggleMilestone = (goalId: string, milestone: Milestone) => {
    updateMilestone(goalId, String(milestone.id), {
      completed: !isMilestoneCompleted(milestone),
    });
  };

  return {
    goals,
    isLoading: weekOffset === 0 ? isCurrentWeekLoading : isLoading,
    isError,
    refetch,
    weekDays,
    stats,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    toggleMilestone,
    isAdding: addMilestoneMutation.isPending,
    isUpdating: updateMilestoneMutation.isPending,
    isDeleting: deleteMilestoneMutation.isPending,
  };
};
