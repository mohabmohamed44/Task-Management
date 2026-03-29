import { addDays, startOfWeek, endOfWeek, addWeeks, isSameDay, parseISO } from "date-fns";

export const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface WeekDay {
  day: string;
  date: Date;
}

export const getWeekDays = (weekStart: Date): WeekDay[] => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: DAYS_OF_WEEK[addDays(weekStart, i).getDay()],
    date: addDays(weekStart, i),
  }));
};

export const getCurrentWeekRange = (weekOffset: number) => {
  const now = addWeeks(new Date(), weekOffset);
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday start to match database
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return { start, end };
};

export const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export interface DayGoal {
  day: string;
  date: Date;
  tasks: any[];
  completedCount: number;
  totalCount: number;
}

export const organizeGoalsByDay = (goals: any[], weekDays: Date[]): DayGoal[] => {
  return weekDays.map((day) => {
    const dayGoals = goals.filter((goal: any) => {
      // Goals are already filtered by week in useWeeklyGoals
      // Now distribute them by created_at date within the week
      const goalCreatedDate = goal.created_at
        ? goal.created_at instanceof Date
          ? goal.created_at
          : parseISO(String(goal.created_at))
        : null;
      
      if (!goalCreatedDate) return false;
      return isSameDay(goalCreatedDate, day);
    });

    const completedCount = dayGoals.filter(
      (g: any) => g.status === "completed" || g.status === "Completed"
    ).length;
    const totalCount = dayGoals.length;

    return {
      day: DAYS_OF_WEEK[day.getDay()],
      date: day,
      tasks: dayGoals,
      completedCount,
      totalCount,
    };
  });
};
