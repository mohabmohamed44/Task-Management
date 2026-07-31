export interface Milestone {
    id: number;
    weeklyGoalId: number;
    title: string;
    completed: boolean;
    position: number;
    createdAt: Date;
}
