import { api } from "@/InfraStructure/api/http";
import { format } from "date-fns";
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

export const WeeklyGoalAPI = {
    // Goal CRUD Operations
    createGoal: (data: CreateGoal) =>
        api.post("/weekly-goals/", {
            title: data.title,
            description: data.description,
            priority: data.priority,
            category: data.category,
            weekStart: format(data.week_start, "yyyy-MM-dd"),
            weekEnd: format(data.week_end, "yyyy-MM-dd")
        }),

    getCurrentWeekGoals: () =>
        api.get("/weekly-goals/current"),

    getGoalsBySpecificWeek: (params: GetGoalsBySpecificWeek) =>
        api.get("/weekly-goals/by-week", {
            params: {
                weekStart: format(params.week_start, "yyyy-MM-dd")
            }
        }),

    getGoalById: (params: GetGoalById) =>
        api.get(`/weekly-goals/${params.goalId}`),

    updateGoal: (goalId: string, data: Partial<updateGoal>) =>
        api.put(`/weekly-goals/${goalId}`, data),

    deleteGoal: (params: DeleteGoal) =>
        api.delete(`/weekly-goals/${params.goalId}`),

    reOrderGoalPosition: (goalId: string, data: reOrderGoalPosition) =>
        api.post(`/weekly-goals/${goalId}/reorder`, data),

    duplicateGoalToNextWeek: (params: DuplicateGoalToNextWeek) =>
        api.post(`/weekly-goals/${params.goalId}/duplicate`, {
            newWeekStart: format(params.newWeekStart, "yyyy-MM-dd"),
            newWeekEnd: format(params.newWeekEnd, "yyyy-MM-dd")
        }),

    // Add Milestone
    addMilestone: (data: addMilestone) => 
        api.post(`/weekly-goals/${data.goalId}/milestones`, { title: data.title }),

    // Milestone Operations
    addMilestoneToGoal: (goalId: string, data: addMilestoneToGoal) =>
        api.post(`/weekly-goals/${goalId}/milestones`, data),

    updateMilestone: (milestoneId: string, data: Partial<UpdateMilestone>) =>
        api.put(`/weekly-goals/milestones/${milestoneId}`, data),

    deleteMilestone: (params: DeleteMilestone) =>
        api.delete(`/weekly-goals/milestones/${params.milestoneId}`),

    // Task-Goal Linking Operations
    linkGoalToTask: (goalId: string, params: linkGoalToTask) =>
        api.post(`/weekly-goals/${goalId}/link-task`, params),

    unlinkTaskFromGoal: (params: UnlinkTaskFromGoal) =>
        api.delete(`/weekly-goals/${params.goalId}/tasks/${params.taskId}`),

    // Statistics Operations
    getWeeklyStatistics: () =>
        api.get("/weekly-goals/stats")
};

