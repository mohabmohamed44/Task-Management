export interface CreateMilestoneDTO {
    title: string;
}

export interface UpdateMilestoneDTO {
    title?: string;
    completed?: boolean;
}

export interface DeleteMilestoneDTO {
    goalId: number | string;
    milestoneId: number | string;
}
