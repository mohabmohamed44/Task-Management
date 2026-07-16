import { useTasksQuery } from "@/app/Queries/task.query";
import { useMemo, useState, useCallback } from "react";
import type { GetTaskQueryDTO, SortOrder } from "@/domain/entities/get-tasks-query.dto";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { getPriorityIconName, getPriorityColor } from "@/domain/utils/task-ui";
import { Link } from "react-router";
import Pagination from "@/presentation/components/pagination";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import {
  AlertCircle,
  Calendar,
  CircleArrowRight,
  Clock,
  ListTodo,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/domain/utils/date";
import MetaData from "../components/MetaData";
import { cn } from "@/lib/utils";
import { useDebounce } from "../hooks/useDebounce";
import type { TaskPriority } from "@/domain/enums/task-priority.enum";
import type { Task } from "@/domain/entities/task.entity";

const PRIORITY_OPTIONS: { value: TaskPriority | "all" | string; label: string }[] = [
  { value: "all", label: "All Priorities" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

type StatusFilter = "all" | "pending" | "completed";

const STATUS_OPTIONS: { value: StatusFilter; label: string; icon: typeof Circle }[] = [
  { value: "all", label: "All", icon: ListTodo },
  { value: "pending", label: "Pending", icon: Circle },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "dueDate-asc", label: "Due Date (Earliest)" },
  { value: "dueDate-desc", label: "Due Date (Latest)" },
  { value: "priority-desc", label: "Priority (Highest)" },
  { value: "priority-asc", label: "Priority (Lowest)" },
];

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date();
}

function isDueSoon(task: Task): boolean {
  if (!task.dueDate || task.completed) return false;
  const soon = new Date();
  soon.setHours(soon.getHours() + 24);
  return new Date(task.dueDate) <= soon && new Date(task.dueDate) >= new Date();
}

function getDueDateStatus(task: Task) {
  if (!task.dueDate) return null;
  if (task.completed) return "completed";
  if (isOverdue(task)) return "overdue";
  if (isDueSoon(task)) return "due-soon";
  return "upcoming";
}

const dueDateStyles = {
  completed: "text-green-600 dark:text-green-400",
  overdue: "text-red-600 dark:text-red-400 font-semibold",
  "due-soon": "text-amber-600 dark:text-amber-400 font-semibold",
  upcoming: "text-muted-foreground",
};

function TaskCardSkeleton() {
  return (
    <Card className="border shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-transparent via-muted to-transparent" />
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex gap-2 pt-2 border-t">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

const TaskPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortValue, setSortValue] = useState("createdAt-desc");

  const debouncedSearch = useDebounce(searchInput, 400);

  const query = useMemo<GetTaskQueryDTO>(() => {
    const [rawSort, order] = sortValue.split("-") as [string, SortOrder];

    return {
      page: currentPage,
      limit: 10,
      // when sorting by priority, backend sorts by createdAt instead
      sort: rawSort === "priority" ? "createdAt" : (rawSort as GetTaskQueryDTO["sort"]),
      order,
      priority: priorityFilter === "all" ? undefined : priorityFilter,
      completed: statusFilter === "all" ? undefined : statusFilter === "completed",
    };
  }, [currentPage, priorityFilter, statusFilter, sortValue]);

  const { data, isLoading, error, refetch } = useTasksQuery(query);

  const tasks = data?.tasks || [];
  const meta = data?.meta;

  const filteredTasks = useMemo(() => {
    const [rawSort, order] = sortValue.split("-") as [string, SortOrder];

    let result = tasks;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (rawSort === "priority") {
      const priorityWeight: Record<string, number> = {
        urgent: 4,
        high: 3,
        medium: 2,
        low: 1,
      };
      result = [...result].sort((a, b) => {
        const diff = priorityWeight[a.priority] - priorityWeight[b.priority];
        return order === "desc" ? -diff : diff;
      });
    }

    return result;
  }, [tasks, debouncedSearch, sortValue]);


  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MetaData title="Tasks" description="Manage and track your tasks" path="/tasks" type="website" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MetaData title="Tasks - Error" description="Failed to load tasks" path="/tasks" type="website" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="bg-destructive/10 p-6 rounded-full">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Failed to load tasks</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {error instanceof Error ? error.message : "Something went wrong"}
              </p>
            </div>
            <Button onClick={() => refetch()} variant="default" size="lg">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaData
        title="Tasks"
        description="Manage and track all your tasks in one place"
        path="/tasks"
        type="website"
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-linear-to-br from-primary to-primary/80 p-3 rounded-xl shadow-lg shadow-primary/20">
                <ListTodo className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Tasks
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Manage and track all your tasks in one place
                </p>
              </div>
            </div>
            <Button asChild size="lg">
              <Link to="/create-task">
                <Plus className="h-4 w-4" />
                Create Task
              </Link>
            </Button>
          </div>
          

          

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Select
                value={priorityFilter}
                onValueChange={(v) => {
                  setPriorityFilter(v as TaskPriority | "all");
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-37.5 h-10">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortValue} onValueChange={setSortValue}>
                <SelectTrigger className="w-42.5 h-10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex rounded-lg border p-0.5 bg-muted/30">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                      statusFilter === opt.value
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <opt.icon className="h-3.5 w-3.5" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          {filteredTasks.length === 0 ? (
            <Card className="border shadow-sm">
              <CardContent className="py-16 text-center">
                <div className="bg-muted p-6 rounded-full w-fit mx-auto mb-6">
                  <Sparkles className="h-14 w-14 text-muted-foreground/60" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchInput || priorityFilter !== "all" || statusFilter !== "all"
                    ? "No tasks match your filters"
                    : "No tasks yet"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {searchInput || priorityFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Create your first task to get started on your journey."}
                </p>
                {!searchInput && priorityFilter === "all" && statusFilter === "all" && (
                  <Button asChild>
                    <Link to="/create-task">
                      <Plus className="h-4 w-4" />
                      Create Your First Task
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>
                  Showing <span className="font-medium text-foreground">{filteredTasks.length}</span>{" "}
                  {filteredTasks.length === 1 ? "task" : "tasks"}
                  {meta && ` (page ${meta.page} of ${meta.totalPages})`}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTasks.map((task) => (
                  <Link key={task.id} to={`/tasks/${task.id}`} className="group block">
                    <Card
                      className={cn(
                        "border shadow-sm hover:shadow-lg transition-all duration-200 h-full overflow-hidden",
                        "hover:-translate-y-1",
                        task.completed && "opacity-60 hover:opacity-80"
                      )}
                    >
                      <div
                        className={cn(
                          "h-1 w-full",
                          task.priority === "urgent" && "bg-red-500",
                          task.priority === "high" && "bg-orange-500",
                          task.priority === "medium" && "bg-yellow-500",
                          task.priority === "low" && "bg-green-500"
                        )}
                      />
                      <CardContent className="p-5 space-y-4">
                        {/* Title & Description */}
                        <div className="space-y-1.5">
                          <h3
                            className={cn(
                              "text-base font-semibold leading-snug group-hover:text-primary transition-colors",
                              task.completed && "line-through text-muted-foreground"
                            )}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Priority + Category + Tags */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-medium px-2.5 py-0.5 flex items-center gap-1",
                              getPriorityColor(task.priority)
                            )}
                          >
                            {getPriorityIconName(task.priority)}
                            {task.priority}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs font-medium px-2.5 py-0.5"
                          >
                            {task.category}
                          </Badge>
                          {task.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                          {task.tags.length > 2 && (
                            <span className="text-[11px] text-muted-foreground">
                              +{task.tags.length - 2}
                            </span>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 shrink-0" />
                              {task.dueDate ? (
                                <span
                                  className={
                                    getDueDateStatus(task)
                                      ? dueDateStyles[getDueDateStatus(task)!]
                                      : ""
                                  }
                                >
                                  {formatDate(task.dueDate)}
                                </span>
                              ) : (
                                <span className="italic">No due date</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span>{formatDate(task.createdAt)}</span>
                            </div>
                          </div>
                          {!task.completed && (
                            <CircleArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                          {task.completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="pt-2 pb-4">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskPage;
