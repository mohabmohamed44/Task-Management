import type { TaskPriority } from "@/domain/enums/task-priority.enum";

export interface CreateGoal {
    title: string;
    description: string;
    priority: TaskPriority;
    category: string;
    week_start: Date;
    week_end: Date;
}

export interface addMilestoneToGoal {
    title: string;
}

export interface addMilestone {
    title: string;
    goalId: string;
}

export interface reOrderGoalPosition {
    weekStart: Date;
    newPosition: string;
}

export interface updateGoal {
    title?: string;
    priority?: TaskPriority;
    status: string;
    progress: number;
}

export interface UpdateMilestone {
    title?: string;
    status?: string;
    progress?: number;
}

export interface GetCurrentWeekGoals {
    startDate: Date;
    endDate: Date;
}

export interface GetGoalsBySpecificWeek {
    week_start: Date;
    week_end: Date;
}

export interface GetGoalById {
    goalId: string;
}

export interface DeleteGoal {
    goalId: string;
}

export interface DeleteMilestone {
    milestoneId: string;
}

export interface DuplicateGoalToNextWeek {
    goalId: string;
    newWeekStart: Date;
    newWeekEnd: Date;
}

export interface GetWeeklyStatistics {
    week_start: Date;
    week_end: Date;
}

export interface UnlinkTaskFromGoal {
    goalId: string;
    taskId: string;
}

export interface linkGoalToTask {
    goalId: string;
}
