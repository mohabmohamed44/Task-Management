export interface GoalsStats {
  total: number;
  completed: number;
  rate: number;
}

export const calculateGoalsStats = (goals: any[]): GoalsStats => {
  const total = Array.isArray(goals) ? goals.length : 0;
  const completed = Array.isArray(goals)
    ? goals.filter((g) => g.status === "completed" || g.status === "Completed" || g.completed).length
    : 0;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, rate };
};

export interface WeeklyStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  daysWithTasks: number;
}

export const calculateWeeklyStats = (
  weeklyGoalsByDay: { totalCount: number; completedCount: number }[]
): WeeklyStats => {
  const safeWeeklyGoalsByDay = Array.isArray(weeklyGoalsByDay) ? weeklyGoalsByDay : [];
  const totalTasks = safeWeeklyGoalsByDay.reduce((sum, day) => sum + day.totalCount, 0);
  const completedTasks = safeWeeklyGoalsByDay.reduce((sum, day) => sum + day.completedCount, 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const daysWithTasks = safeWeeklyGoalsByDay.filter((day) => day.totalCount > 0).length;

  return { totalTasks, completedTasks, completionRate, daysWithTasks };
};
