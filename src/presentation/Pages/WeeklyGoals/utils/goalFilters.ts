export type FilterStatus = "all" | "Completed" | "Pending";

export const filterGoals = (
  goals: any[],
  filterStatus: FilterStatus,
  searchQuery: string
): any[] => {
  let filtered = [...goals];

  // Filter by status
  if (filterStatus === "Completed") {
    filtered = filtered.filter((g: any) => g.status === "completed" || g.status === "Completed");
  } else if (filterStatus === "Pending") {
    filtered = filtered.filter((g: any) => g.status !== "Completed" && g.status !== "completed");
  }

  // Filter by search
  if (searchQuery) {
    filtered = filtered.filter(
      (g: any) =>
        g.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filtered;
};
