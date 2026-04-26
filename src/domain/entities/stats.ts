export interface ContributionDay {
  date: string; 
  count: number; 
}

export interface UserStats {
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  contributions: ContributionDay[];
}

export interface GitHubStreakProps {
  data: ContributionDay[];
  isLoading?: boolean;
}