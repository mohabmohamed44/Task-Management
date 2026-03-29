import { useMemo } from "react";
import {
  useGoalsBySpecificWeekQuery,
  useCurrentWeekGoalsQuery,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useCreateGoalMutation,
  useWeeklyStatisticsQuery,
} from "@/app/Queries/weeklyGoals.query";
import { TaskPriority } from "@/domain/enums/task-priority.enum";
import {
  getWeekDays,
  getCurrentWeekRange,
  organizeGoalsByDay,
} from "@/presentation/Pages/WeeklyGoals/utils/dateHelpers";
import { calculateGoalsStats, calculateWeeklyStats } from "@/presentation/Pages/WeeklyGoals/utils/goalStats";
import { filterGoals, type FilterStatus } from "@/presentation/Pages/WeeklyGoals/utils/goalFilters";

export interface UseWeeklyGoalsReturn {
  // Data
  goals: any[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  weeklyGoalsByDay: ReturnType<typeof organizeGoalsByDay>;
  
  // Current week data (always available)
  currentWeekGoals: any[];
  isCurrentWeekLoading: boolean;
  
  // Stats
  goalsStats: ReturnType<typeof calculateGoalsStats>;
  weeklyStats: ReturnType<typeof calculateWeeklyStats>;
  
  // Week navigation
  currentWeekStart: Date;
  currentWeekEnd: Date;
  weekDays: ReturnType<typeof getWeekDays>;
  
  // Mutations
  toggleGoalCompletion: (goalId: string, currentStatus: string) => void;
  deleteGoal: (goalId: string) => void;
  updateGoal: (goalId: string, data: any) => void;
  createGoal: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    category: string;
  }) => void;
  
  // Mutation states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const useWeeklyGoals = (weekOffset: number): UseWeeklyGoalsReturn => {
  // Week calculations
  // Compute on render so if the app stays open across midnight/week rollover,
  // the computed range updates on the next re-render.
  const { start: currentWeekStart, end: currentWeekEnd } = getCurrentWeekRange(weekOffset);

  // Always compute the real current week range (today's week)
  const { start: realCurrentWeekStart, end: realCurrentWeekEnd } = getCurrentWeekRange(0);

  // Fetch data for selected week
  const { data: currentWeekGoals, isLoading, isError, refetch } = useGoalsBySpecificWeekQuery({
    week_start: currentWeekStart,
    week_end: currentWeekEnd,
  });

  // Always fetch current week data using dedicated endpoint
  const { data: actualCurrentWeekGoals, isLoading: isCurrentWeekLoading } = useCurrentWeekGoalsQuery();

  useWeeklyStatisticsQuery({
    week_start: currentWeekStart,
    week_end: currentWeekEnd,
  });

  // Mutations
  const updateGoalMutation = useUpdateGoalMutation();
  const deleteGoalMutation = useDeleteGoalMutation();
  const createGoalMutation = useCreateGoalMutation();

  const weekDays = useMemo(
    () => getWeekDays(currentWeekStart),
    [currentWeekStart]
  );

  // Goals data - use current week if offset is 0, otherwise use selected week
  const goals = useMemo(() => {
    if (weekOffset === 0) {
      return actualCurrentWeekGoals || [];
    }
    return currentWeekGoals || [];
  }, [currentWeekGoals, actualCurrentWeekGoals, weekOffset]);

  // Organize goals by day
  const weeklyGoalsByDay = useMemo(
    () => organizeGoalsByDay(goals, weekDays.map((d) => d.date)),
    [goals, weekDays]
  );

  // Stats calculations
  const goalsStats = useMemo(() => calculateGoalsStats(goals), [goals]);
  const weeklyStats = useMemo(
    () => calculateWeeklyStats(weeklyGoalsByDay),
    [weeklyGoalsByDay]
  );

  // Business logic: toggle goal completion
  const toggleGoalCompletion = (goalId: string, currentStatus: string) => {
    const isCompleted =
      currentStatus === "completed" ||
      currentStatus === "Completed";
    const newStatus = isCompleted ? "Pending" : "Completed";
    const newProgress = isCompleted ? 0 : 100;

    updateGoalMutation.mutate({
      goalId,
      data: {
        status: newStatus,
        progress: newProgress,
      },
    });
  };

  // Business logic: delete goal
  const deleteGoal = (goalId: string) => {
    deleteGoalMutation.mutate({ goalId });
  };

  // Business logic: update goal
  const updateGoal = (goalId: string, data: any) => {
    updateGoalMutation.mutate({
      goalId,
      data,
    });
  };

  // Business logic: create goal
  const createGoal = (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    category: string;
  }) => {
    // If you're browsing a past/future week, still create goals into the real current week
    // so goals created after midnight go to the new week (today's week).
    const weekStartToUse = weekOffset === 0 ? currentWeekStart : realCurrentWeekStart;
    const weekEndToUse = weekOffset === 0 ? currentWeekEnd : realCurrentWeekEnd;

    createGoalMutation.mutate({
      ...data,
      week_start: weekStartToUse,
      week_end: weekEndToUse,
    });
  };

  return {
    goals: goals || [],
    isLoading,
    isError,
    refetch,
    weeklyGoalsByDay,
    goalsStats,
    weeklyStats,
    currentWeekStart,
    currentWeekEnd,
    weekDays,
    currentWeekGoals: actualCurrentWeekGoals || [],
    isCurrentWeekLoading,
    toggleGoalCompletion,
    deleteGoal,
    updateGoal,
    createGoal,
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,
  };
};

export const useFilteredGoals = (
  goals: any[],
  filterStatus: FilterStatus,
  searchQuery: string
) => {
  return useMemo(
    () => filterGoals(goals, filterStatus, searchQuery),
    [goals, filterStatus, searchQuery]
  );
};
