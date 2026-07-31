export interface MilestoneStats {
  totalGoals: number;
  goalsWithMilestones: number;
  totalMilestones: number;
  completedMilestones: number;
  completionRate: number;
}

export const isMilestoneCompleted = (milestone: any): boolean => {
  return (
    milestone?.status === "completed" ||
    milestone?.status === "Completed" ||
    milestone?.progress === 100 ||
    milestone?.completed === true
  );
};

export const calculateMilestoneStats = (goals: any[]): MilestoneStats => {
  const safeGoals = Array.isArray(goals) ? goals : [];
  const allMilestones = safeGoals.flatMap((goal) => (Array.isArray(goal?.milestones) ? goal.milestones : []));
  const totalMilestones = allMilestones.length;
  const completedMilestones = allMilestones.filter(isMilestoneCompleted).length;

  return {
    totalGoals: safeGoals.length,
    goalsWithMilestones: safeGoals.filter((goal) => (Array.isArray(goal?.milestones) ? goal.milestones.length : 0) > 0).length,
    totalMilestones,
    completedMilestones,
    completionRate: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0,
  };
};
