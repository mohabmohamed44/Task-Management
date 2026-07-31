import { useEffect, useState } from "react";
import {
  Target,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Clock,
  BarChart3,
  Filter,
  CheckCircle,
  Circle,
  AlertCircle,
  Edit,
  Trash2,
  CalendarX,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader } from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";
import { Button } from "@/presentation/components/Button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";

import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import MetaData from "../components/MetaData";
import { SanitizedSearchInput } from "@/presentation/components/SanitizedSearchInput";
import { useWeeklyGoals } from "@/app/hooks/useWeeklyGoals";
import { AddGoalModal, GoalDetailsModal, EditGoalModal } from "./WeeklyGoals/components";
import { type FilterStatus } from "./WeeklyGoals/utils/goalFilters";
import { formatDateDisplay } from "./WeeklyGoals/utils/dateHelpers";

export default function WeeklyGoals() {
  // UI state
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [, forceTick] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Re-render periodically so if the app stays open across midnight/week rollover,
  // week ranges and React Query keys can update.
  useEffect(() => {
    const id = window.setInterval(() => {
      forceTick((t) => t + 1);
    }, 60_000);

    return () => window.clearInterval(id);
  }, []);

  // Data and business logic via custom hook
  const {
    isLoading,
    isError,
    weeklyGoalsByDay,
    goalsStats,
    weeklyStats,
    weekDays,
    toggleGoalCompletion,
    refetch,
    deleteGoal,
    createGoal,
    isCreating,
    updateGoal,
    isUpdating,
  } = useWeeklyGoals(currentWeekOffset);

  // Navigation handlers
  const goToPreviousWeek = () => setCurrentWeekOffset((prev) => prev - 1);
  const goToNextWeek = () => setCurrentWeekOffset((prev) => prev + 1);
  const goToCurrentWeek = () => setCurrentWeekOffset(0);

  // Check if date is today
  const isToday = (date: Date) => isSameDay(date, new Date());

  const handleViewGoal = (goal: any) => {
    setSelectedGoal(goal);
    setIsDetailsOpen(true);
  };

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setIsEditOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-black dark:border-t-white absolute top-0"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading Weekly Goals...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full w-fit mx-auto">
            <AlertCircle className="h-16 w-16 text-gray-900 dark:text-gray-100" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error loading statistics</h3>
          <p className="text-gray-500 dark:text-gray-400">Unable to load task statistics. Please try again.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaData
        title="Weekly Goals"
        description="Track and Manage your goals efficiently"
        path="/goals"
        image="/goals-og.png"
        type="website"
        noIndex={false}
      />
      <div
        className="min-h-screen p-4 md:p-6 lg:p-8 selection:text-white selection:bg-gray-900 dark:selection:bg-white dark:selection:text-gray-900"
        role="main"
        aria-label="Weekly Goals Page"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <Header
            weekDays={weekDays}
            onPreviousWeek={goToPreviousWeek}
            onNextWeek={goToNextWeek}
            onCurrentWeek={goToCurrentWeek}
          />

          {/* Stats Overview Cards */}
          <StatsOverview
            goalsStats={goalsStats}
            weeklyStats={weeklyStats}
            weekDaysCount={weekDays.length}
          />

          {/* Week Calendar */}
          <WeekCalendar
            weeklyGoalsByDay={weeklyGoalsByDay}
            isToday={isToday}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isModalOpen={isModalOpen}
            onModalOpenChange={setIsModalOpen}
            onToggleGoal={toggleGoalCompletion}
            onDeleteGoal={deleteGoal}
            onViewGoal={handleViewGoal}
            onEditGoal={handleEditGoal}
            onCreateGoal={createGoal}
            isCreating={isCreating}
          />
        </div>
      </div>

      <GoalDetailsModal
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />

      <EditGoalModal
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setSelectedGoal(null);
        }}
        goal={selectedGoal}
        onSubmit={(goalId, data) => updateGoal(goalId, data)}
        isPending={isUpdating}
      />
    </>
  );
}

// Sub-components

interface HeaderProps {
  weekDays: { day: string; date: Date }[];
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
}

function Header({ weekDays, onPreviousWeek, onNextWeek, onCurrentWeek }: HeaderProps) {
  return (
    <header className="mb-8 md:mb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 dark:bg-gray-100 p-3 rounded-xl" aria-hidden="true">
            <Target className="h-7 w-7 text-white dark:text-gray-900" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">Weekly Goals</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg">
              Track your progress and achieve your weekly objectives
            </p>
          </div>
        </div>

        <WeekNavigation onPrevious={onPreviousWeek} onNext={onNextWeek} onCurrent={onCurrentWeek} />
      </div>

      <div className="mt-4 flex items-center gap-2 text-gray-600 dark:text-gray-400" aria-live="polite">
        <Calendar className="h-4 w-4" />
        <span className="text-sm font-medium">
          {formatDateDisplay(weekDays[0]?.date)} - {formatDateDisplay(weekDays[6]?.date)},{" "}
          {format(weekDays[0]?.date, "yyyy")}
        </span>
      </div>
    </header>
  );
}

interface WeekNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onCurrent: () => void;
}

function WeekNavigation({ onPrevious, onNext, onCurrent }: WeekNavigationProps) {
  return (
    <div
      className="flex flex-row sm:flex-row items-stretch sm:items-center gap-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-1"
      role="navigation"
      aria-label="Week navigation"
    >
      <Button variant="ghost" size="icon" onClick={onPrevious} aria-label="Go to previous week" className="h-9 w-full sm:w-9">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        onClick={onCurrent}
        aria-label="Go to current week"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 w-full sm:w-auto"
      >
        This Week
      </Button>
      <Button variant="ghost" size="icon" onClick={onNext} aria-label="Go to next week" className="h-9 w-full sm:w-9">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface StatsOverviewProps {
  goalsStats: { total: number; completed: number; rate: number };
  weeklyStats: { totalTasks: number; completedTasks: number; completionRate: number; daysWithTasks: number };
  weekDaysCount: number;
}

function StatsOverview({ goalsStats, weeklyStats, weekDaysCount }: StatsOverviewProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-label="Weekly statistics">
      <StatCard
        icon={<BarChart3 className="h-4 w-4" />}
        label="Total Goals"
        value={goalsStats.total}
        subtext={goalsStats.total > 0 ? `Across ${weekDaysCount} days` : "Set your first goal"}
      />
      <StatCard
        icon={<Target className="h-4 w-4" />}
        label="Completed"
        value={goalsStats.completed}
        subtext="Goals completed this week"
      />
      <StatCard
        icon={<TrendingUp className="h-4 w-4" />}
        label="Completion Rate"
        value={`${goalsStats.rate}%`}
        showProgress
        progressValue={goalsStats.rate}
      />
      <StatCard
        icon={<Clock className="h-4 w-4" />}
        label="Active Days"
        value={weeklyStats.daysWithTasks}
        subtext={`Out of ${weekDaysCount} days this week`}
      />
    </section>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  showProgress?: boolean;
  progressValue?: number;
}

function StatCard({ icon, label, value, subtext, showProgress, progressValue }: StatCardProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          {icon}
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
        {subtext && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtext}</p>}
        {showProgress && progressValue !== undefined && (
          <Progress
            value={progressValue}
            className="mt-2 h-2 bg-gray-200 dark:bg-gray-700"
            aria-label={`Completion rate: ${progressValue}%`}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface WeekCalendarProps {
  weeklyGoalsByDay: any[];
  isToday: (date: Date) => boolean;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isModalOpen: boolean;
  onModalOpenChange: (open: boolean) => void;
  onToggleGoal: (goalId: string, currentStatus: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onViewGoal: (goal: any) => void;
  onEditGoal: (goal: any) => void;
  onCreateGoal: (data: any) => void;
  isCreating: boolean;
}

function WeekCalendar({
  weeklyGoalsByDay,
  isToday,
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
  isModalOpen,
  onModalOpenChange,
  onToggleGoal,
  onDeleteGoal,
  onViewGoal,
  onEditGoal,
  onCreateGoal,
  isCreating,
}: WeekCalendarProps) {
  return (
    <section className="mb-8" aria-label="Weekly calendar">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">Week Calendar</span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <SanitizedSearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search goals..."
            className="w-full sm:w-56"
            ariaLabel="Search goals"
          />
          <FilterSelect value={filterStatus} onChange={onFilterChange} />
          <AddGoalModal isOpen={isModalOpen} onOpenChange={onModalOpenChange} onAdd={onCreateGoal} isPending={isCreating} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 xl:gap-px xl:overflow-hidden xl:rounded-xl xl:border xl:border-gray-200 xl:bg-gray-200 dark:xl:border-gray-800 dark:xl:bg-gray-800">
        {weeklyGoalsByDay.map((dayGoal, index) => (
          <DayColumn
            key={index}
            dayGoal={dayGoal}
            isToday={isToday}
            filterStatus={filterStatus}
            searchQuery={searchQuery}
            onToggleGoal={onToggleGoal}
            onDeleteGoal={onDeleteGoal}
            onViewGoal={onViewGoal}
            onEditGoal={onEditGoal}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-900 dark:bg-gray-100" />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-gray-400 dark:border-gray-500" />
          Pending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
          Today
        </span>
        <span className="ml-auto hidden sm:flex items-center gap-1.5">
          {weeklyStatsPreviewLabel(weeklyGoalsByDay)}
        </span>
      </div>
    </section>
  );
}

function weeklyStatsPreviewLabel(weeklyGoalsByDay: any[]): string {
  const total = weeklyGoalsByDay.reduce((sum, day) => sum + day.totalCount, 0);
  const completed = weeklyGoalsByDay.reduce((sum, day) => sum + day.completedCount, 0);
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  return `${completed}/${total} goals completed this week (${rate}%)`;
}

interface DayColumnProps {
  dayGoal: any;
  isToday: (date: Date) => boolean;
  filterStatus: FilterStatus;
  searchQuery: string;
  onToggleGoal: (goalId: string, currentStatus: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onViewGoal: (goal: any) => void;
  onEditGoal: (goal: any) => void;
}

function DayColumn({
  dayGoal,
  isToday,
  filterStatus,
  searchQuery,
  onToggleGoal,
  onDeleteGoal,
  onViewGoal,
  onEditGoal,
}: DayColumnProps) {
  const today = isToday(dayGoal.date);
  const tasks = dayGoal.tasks.filter((goal: any) => matchesDayFilter(goal, filterStatus, searchQuery));
  const progress = dayGoal.totalCount > 0 ? Math.round((dayGoal.completedCount / dayGoal.totalCount) * 100) : 0;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-gray-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-900 xl:h-125 xl:rounded-none xl:border-0",
        today && "bg-gray-50 dark:bg-gray-800/60"
      )}
      role="listitem"
      aria-label={`${dayGoal.day}, ${format(dayGoal.date, "MMMM d, yyyy")}: ${dayGoal.completedCount} of ${dayGoal.totalCount} goals completed`}
    >
      <header className="flex flex-row items-center justify-between gap-1 border-b border-gray-100 dark:border-gray-800 px-3 py-3 xl:flex-col xl:items-center xl:justify-start xl:gap-1 xl:px-2 xl:pb-3 xl:pt-3">
        <div className="flex items-center gap-2.5 xl:flex-col xl:gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            {dayGoal.day.slice(0, 3)}
          </span>
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-base font-bold",
              today
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "text-gray-900 dark:text-gray-100"
            )}
          >
            {format(dayGoal.date, "d")}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {format(dayGoal.date, "MMM")}
          </span>
        </div>
        {today && (
          <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white dark:bg-white dark:text-gray-900">
            Today
          </span>
        )}
      </header>

      <div className="flex-1 space-y-1.5 overflow-y-auto p-1.5 max-h-96 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 xl:max-h-none">
        {tasks.map((goal: any) => (
          <CalendarGoalItem
            key={goal.id}
            goal={goal}
            onToggle={onToggleGoal}
            onDelete={onDeleteGoal}
            onView={onViewGoal}
            onEdit={onEditGoal}
          />
        ))}
        {tasks.length === 0 && (
          <div
            className="flex h-full min-h-30 flex-col items-center justify-center gap-1 text-center"
            role="status"
            aria-label={`No goals for ${dayGoal.day}`}
          >
            <CalendarX className="h-6 w-6 text-gray-200 dark:text-gray-700" />
            <p className="text-xs text-gray-400 dark:text-gray-500">No goals</p>
            {today && <p className="text-[10px] text-gray-300 dark:text-gray-600">Plan something</p>}
          </div>
        )}
      </div>

      <footer className="border-t border-gray-100 dark:border-gray-800 px-3 py-2.5">
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800" aria-hidden="true">
          <div
            className="h-full rounded-full bg-gray-900 transition-all duration-300 dark:bg-gray-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
            {dayGoal.completedCount}/{dayGoal.totalCount} done
          </span>
          {dayGoal.totalCount > 0 && (
            <span className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">{progress}%</span>
          )}
        </div>
      </footer>
    </div>
  );
}

interface CalendarGoalItemProps {
  goal: any;
  onToggle: (goalId: string, currentStatus: string) => void;
  onDelete: (goalId: string) => void;
  onView: (goal: any) => void;
  onEdit: (goal: any) => void;
}

function CalendarGoalItem({ goal, onToggle, onDelete, onView, onEdit }: CalendarGoalItemProps) {
  const isCompleted = goal.status === "completed" || goal.status === "Completed";

  return (
    <div
      className={cn(
        "group relative flex items-start gap-1.5 rounded-lg border p-2 transition-colors",
        isCompleted
          ? "border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/60"
          : "border-gray-200 bg-white hover:border-gray-900 dark:border-gray-700/60 dark:bg-gray-900 dark:hover:border-gray-400"
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(goal.id, goal.status);
        }}
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        className={cn(
          "mt-0.5 shrink-0 cursor-pointer transition-colors",
          isCompleted
            ? "text-gray-400"
            : "text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
        )}
      >
        {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      </button>

      <button
        type="button"
        onClick={() => onView(goal)}
        className="min-w-0 flex-1 cursor-pointer text-left"
        aria-label={`View goal: ${goal.title}`}
      >
        <span
          className={cn(
            "block truncate text-xs font-medium",
            isCompleted ? "text-gray-400 line-through" : "text-gray-800 dark:text-gray-200"
          )}
        >
          {goal.title}
        </span>
        {goal.category && (
          <span className="mt-0.5 block truncate text-[10px] text-gray-400 dark:text-gray-500">{goal.category}</span>
        )}
      </button>

      <div className="flex shrink-0 items-center gap-0.5 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(goal)}
          aria-label="Edit goal"
          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <Edit className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          aria-label="Delete goal"
          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

interface FilterSelectProps {
  value: FilterStatus;
  onChange: (value: FilterStatus) => void;
}

function FilterSelect({ value, onChange }: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
        aria-label="Filter goals"
      >
        <Filter className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-900">
        <SelectGroup>
          <SelectLabel>Filter</SelectLabel>
          <SelectItem value="all">All Goals</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function matchesDayFilter(goal: any, filterStatus: FilterStatus, searchQuery: string): boolean {
  const isCompleted = goal.status === "completed" || goal.status === "Completed";
  if (filterStatus === "Completed" && !isCompleted) return false;
  if (filterStatus === "Pending" && isCompleted) return false;
  if (searchQuery) {
    const q = searchQuery.trim().toLowerCase();
    return Boolean(
      goal.title?.toLowerCase().includes(q) || goal.description?.toLowerCase().includes(q)
    );
  }
  return true;
}
