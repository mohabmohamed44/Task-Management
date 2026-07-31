import { api } from "@/InfraStructure/api/http";
import type {
    CreateMilestoneDTO,
    UpdateMilestoneDTO,
    DeleteMilestoneDTO,
} from "@/domain/entities/milestones.dto";

export const MilestoneAPI = {
    addToGoal: (goalId: string, data: CreateMilestoneDTO) =>
        api.post(`/weekly-goals/${goalId}/milestones`, data),

    update: (goalId: string, milestoneId: string, data: Partial<UpdateMilestoneDTO>) =>
        api.put(`/weekly-goals/${goalId}/milestones/${milestoneId}`, data),

    delete: (params: DeleteMilestoneDTO) =>
        api.delete(`/weekly-goals/${params.goalId}/milestones/${params.milestoneId}`),
};
