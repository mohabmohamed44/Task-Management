import { useMemo } from "react";
import { useTasksQuery } from "@/app/Queries/task.query";
import { useWeeklyGoals } from "@/app/hooks/useWeeklyGoals";
import { isSameDay } from "date-fns";

export interface HomeWeeklyChartItem {
  label: string;
  [key: string]: string | number;
  created: number;
  completed: number;
  goals: number;
}

export interface UseHomeAnalyticsReturn {
  completedCount: number;
  pendingCount: number;
  totalCount: number;
  completionRate: number;
  weeklyChartData: HomeWeeklyChartItem[];
}

export const useHomeAnalytics = (): UseHomeAnalyticsReturn => {
  const { data } = useTasksQuery({});

  const tasks = useMemo(() => {
    const t = data?.tasks ?? [];
    return Array.isArray(t) ? t : [];
  }, [data?.tasks]);
  const completedCount = useMemo(
    () => {
      const safeTasks = Array.isArray(tasks) ? tasks : [];
      return safeTasks.filter((t) => t.completed).length;
    },
    [tasks]
  );
  const pendingCount = useMemo(
    () => {
      const safeTasks = Array.isArray(tasks) ? tasks : [];
      return safeTasks.filter((t) => !t.completed).length;
    },
    [tasks]
  );
  const totalCount = useMemo(() => tasks.length, [tasks]);
  const completionRate = useMemo(
    () => (totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0),
    [completedCount, totalCount]
  );

  const { weeklyGoalsByDay, weekDays } = useWeeklyGoals(0);

  const weeklyChartData = useMemo(() => {
    const safeWeekDays = Array.isArray(weekDays) && weekDays.length === 7 ? weekDays : [];

    return safeWeekDays.map((wd) => {
      // Track tasks created on this day
      const tasksCreated = tasks.filter((task) => {
        return isSameDay(new Date(task.createdAt), wd.date);
      }).length;

      // Track tasks completed on this day (by updatedAt to catch ANY completion done today)
      const tasksCompleted = tasks.filter((task) => {
        if (!task.completed) return false;
        return isSameDay(new Date(task.updatedAt), wd.date);
      }).length;

      const dayGoal = weeklyGoalsByDay.find(
        (d) => isSameDay(d.date, wd.date)
      );
      const goalsCompleted = dayGoal?.completedCount ?? 0;

      return {
        label: wd.day.slice(0, 3),
        created: tasksCreated,
        completed: tasksCompleted,
        goals: goalsCompleted,
      };
    });
  }, [tasks, weekDays, weeklyGoalsByDay]);

  return {
    completedCount,
    pendingCount,
    totalCount,
    completionRate,
    weeklyChartData,
  };
};
