import { useMemo } from "react";
import {
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
} from "../utils/dateHelpers";
import { calculateGoalsStats, calculateWeeklyStats } from "../utils/goalStats";
import { filterGoals, type FilterStatus } from "../utils/goalFilters";

export interface UseWeeklyGoalsReturn {
  // Data
  goals: any[];
  isLoading: boolean;
  weeklyGoalsByDay: ReturnType<typeof organizeGoalsByDay>;
  
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
  // Week calculations (must be before data fetching that depends on them)
  const { start: currentWeekStart, end: currentWeekEnd } = useMemo(
    () => getCurrentWeekRange(weekOffset),
    [weekOffset]
  );

  // Fetch data
  const { data: currentWeekGoals, isLoading } = useCurrentWeekGoalsQuery();
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

  // Goals data
  const goals = useMemo(() => currentWeekGoals || [], [currentWeekGoals]);

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

  // Business logic: create goal
  const createGoal = (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    category: string;
  }) => {
    createGoalMutation.mutate({
      ...data,
      week_start: currentWeekStart,
      week_end: currentWeekEnd,
    });
  };

  return {
    goals,
    isLoading,
    weeklyGoalsByDay,
    goalsStats,
    weeklyStats,
    currentWeekStart,
    currentWeekEnd,
    weekDays,
    toggleGoalCompletion,
    deleteGoal,
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
