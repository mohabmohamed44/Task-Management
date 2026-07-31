export type MilestoneStatus = "Planned" | "In Progress" | "Achieved";

export interface MilestoneDeliverable {
  id: string;
  title: string;
  completed: boolean;
}

export interface MilestoneTeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface MilestoneLog {
  date: string;
  action: string;
  author: string;
}

export interface UIMilestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  dueDate: string;
  priority: string;
  deliverables: MilestoneDeliverable[];
  assignedTeam: MilestoneTeamMember[];
  logs: MilestoneLog[];
  featured?: boolean;
  extraTeamCount?: number;
}
