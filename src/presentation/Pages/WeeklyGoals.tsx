import { useState } from "react";
import {
  Target,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Clock,
  BarChart3,
  Sparkles,
  Filter,
  Search,
  CheckCircle,
  Circle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";
import { Button } from "@/presentation/components/Button";
import { Badge } from "@/presentation/components/ui/badge";
import { Separator } from "@/presentation/components/ui/separator";
import { Input } from "@/presentation/components/ui/input";
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
import MetaData from "../components/MetaData";
import { useWeeklyGoals, useFilteredGoals } from "@/app/hooks/useWeeklyGoals";
import { GoalList, AddGoalModal, GoalDetailsModal, EditGoalModal } from "./WeeklyGoals/components";
import { type FilterStatus } from "./WeeklyGoals/utils/goalFilters";
import { formatDateDisplay } from "./WeeklyGoals/utils/dateHelpers";

export default function WeeklyGoals() {
  // UI state
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Data and business logic via custom hook
  const {
    goals,
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

  // Filter goals based on UI state
  const filteredGoals = useFilteredGoals(goals, filterStatus, searchQuery);

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


  if(isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-border"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-primary absolute top-0"></div>
          </div>
          <p className="text-muted-foreground font-medium">Loading Weekly Goals...</p>
        </div>
      </div>
    )
  }

  if(isError) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="bg-destructive/10 p-6 rounded-full w-fit mx-auto">
              <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
            <h3 className="text-xl font-semibold text-foreground">Error loading statistics</h3>
            <p className="text-muted-foreground">Unable to load task statistics. Please try again.</p>
            <Button variant="outline" onClick={() => refetch()}>
                Retry
            </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <MetaData
        title="Weekly Goals"
        description="Track and Manage your goals efficiently"
        path="/goals"
        image="/goals-og.png"
        type="website"
      />
      <div
        className="min-h-screen p-4 md:p-6 lg:p-8 selection:text-white selection:bg-gray-900"
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
          <StatsOverview goalsStats={goalsStats} weekDaysCount={weekDays.length} />

          {/* Goals of the Week Section */}
          <GoalsSection
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isModalOpen={isModalOpen}
            onModalOpenChange={setIsModalOpen}
            goalsStats={goalsStats}
            filteredGoals={filteredGoals}
            onToggleGoal={toggleGoalCompletion}
            onDeleteGoal={deleteGoal}
            onViewGoal={handleViewGoal}
            onEditGoal={handleEditGoal}
            onCreateGoal={createGoal}
            isCreating={isCreating}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WeeklyProgressCard
              completionRate={weeklyStats.completionRate}
              weeklyGoalsByDay={weeklyGoalsByDay}
              isToday={isToday}
            />
            <DailyGoalsCards
              weeklyGoalsByDay={weeklyGoalsByDay}
              isLoading={isLoading}
              isToday={isToday}
            />
          </div>
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
    <header className="mb-8 md:mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-xl shadow-sm" aria-hidden="true">
            <Target className="h-7 w-7 text-gray-700 dark:text-gray-300" />
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
      className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-1"
      role="navigation"
      aria-label="Week navigation"
    >
      <Button variant="ghost" size="icon" onClick={onPrevious} aria-label="Go to previous week" className="h-9 w-9">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        onClick={onCurrent}
        aria-label="Go to current week"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3"
      >
        This Week
      </Button>
      <Button variant="ghost" size="icon" onClick={onNext} aria-label="Go to next week" className="h-9 w-9">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface StatsOverviewProps {
  goalsStats: { total: number; completed: number; rate: number };
  weekDaysCount: number;
}

function StatsOverview({ goalsStats, weekDaysCount }: StatsOverviewProps) {
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
        label="Remaining"
        value={goalsStats.total - goalsStats.completed}
        subtext="Goals to complete"
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

interface GoalsSectionProps {
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isModalOpen: boolean;
  onModalOpenChange: (open: boolean) => void;
  goalsStats: { total: number; completed: number; rate: number };
  filteredGoals: any[];
  onToggleGoal: (goalId: string, currentStatus: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onViewGoal: (goal: any) => void;
  onEditGoal: (goal: any) => void;
  onCreateGoal: (data: any) => void;
  isCreating: boolean;
}

function GoalsSection({
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
  isModalOpen,
  onModalOpenChange,
  goalsStats,
  filteredGoals,
  onToggleGoal,
  onDeleteGoal,
  onViewGoal,
  onEditGoal,
  onCreateGoal,
  isCreating,
}: GoalsSectionProps) {
  return (
    <section className="mb-8" aria-label="Goals of the week">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
                <Target className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                Goals of the Week
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                Set and track your weekly objectives
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <FilterSelect value={filterStatus} onChange={onFilterChange} />
              <AddGoalModal isOpen={isModalOpen} onOpenChange={onModalOpenChange} onAdd={onCreateGoal} isPending={isCreating} />
            </div>
          </div>

          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </CardHeader>

        <CardContent>
          <GoalsStatsBar goalsStats={goalsStats} />
          <GoalList
            goals={filteredGoals}
            onToggle={onToggleGoal}
            onDelete={onDeleteGoal}
            onView={onViewGoal}
            onEdit={onEditGoal}
          />
        </CardContent>
      </Card>
    </section>
  );
}

interface FilterSelectProps {
  value: FilterStatus;
  onChange: (value: FilterStatus) => void;
}

function FilterSelect({ value, onChange }: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32.5 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" aria-label="Filter goals">
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

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mt-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Search goals..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          aria-label="Search goals"
        />
      </div>
    </div>
  );
}

interface GoalsStatsBarProps {
  goalsStats: { total: number; completed: number; rate: number };
}

function GoalsStatsBar({ goalsStats }: GoalsStatsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Total Goals:</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">{goalsStats.total}</span>
      </div>
      <Separator orientation="vertical" className="h-4 bg-gray-300 dark:bg-gray-700" />
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-400">Completed:</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">{goalsStats.completed}</span>
      </div>
      <Separator orientation="vertical" className="h-4 bg-gray-300 dark:bg-gray-700" />
      <div className="flex items-center gap-2">
        <Progress
          value={goalsStats.rate}
          className="w-24 h-2 bg-gray-200 dark:bg-gray-700"
          aria-label={`Goals completion rate: ${goalsStats.rate}%`}
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">{goalsStats.rate}%</span>
      </div>
    </div>
  );
}

interface WeeklyProgressCardProps {
  completionRate: number;
  weeklyGoalsByDay: any[];
  isToday: (date: Date) => boolean;
}

function WeeklyProgressCard({ completionRate, weeklyGoalsByDay, isToday }: WeeklyProgressCardProps) {
  return (
    <Card className="lg:col-span-1 border border-gray-200 dark:border-gray-800 shadow bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
          <Sparkles className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          Weekly Progress
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">Your overall progress this week</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="relative w-32 h-32" role="img" aria-label={`Weekly completion: ${completionRate}%`}>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="12" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                className="text-gray-800 dark:text-gray-200 transition-all duration-500"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${completionRate * 2.64} 264`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{completionRate}%</span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-gray-800" />

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Daily Breakdown</h3>
          <div className="space-y-3">
            {weeklyGoalsByDay.map((dayGoal, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium w-20 ${
                      isToday(dayGoal.date) ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {dayGoal.day.slice(0, 3)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">{formatDateDisplay(dayGoal.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={dayGoal.totalCount > 0 ? (dayGoal.completedCount / dayGoal.totalCount) * 100 : 0}
                    className="w-16 h-2 bg-gray-200 dark:bg-gray-700"
                    aria-label={`${dayGoal.day} progress: ${dayGoal.completedCount} of ${dayGoal.totalCount} goals completed`}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-12 text-right">
                    {dayGoal.completedCount}/{dayGoal.totalCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DailyGoalsCardsProps {
  weeklyGoalsByDay: any[];
  isLoading: boolean;
  isToday: (date: Date) => boolean;
}

function DailyGoalsCards({ weeklyGoalsByDay, isLoading, isToday }: DailyGoalsCardsProps) {
  return (
    <div className="lg:col-span-2 space-y-4" role="list" aria-label="Daily goals">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Daily Goals</h2>

      {isLoading ? (
        Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="animate-pulse" aria-hidden="true">
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
            </CardContent>
          </Card>
        ))
      ) : (
        weeklyGoalsByDay.map((dayGoal, index) => <DayCard key={index} dayGoal={dayGoal} isToday={isToday} />)
      )}
    </div>
  );
}

interface DayCardProps {
  dayGoal: any;
  isToday: (date: Date) => boolean;
}

function DayCard({ dayGoal, isToday }: DayCardProps) {
  const today = isToday(dayGoal.date);
  const isDayComplete = dayGoal.completedCount === dayGoal.totalCount && dayGoal.totalCount > 0;

  return (
    <Card
      className={`border transition-all duration-200 ${
        today
          ? "border-gray-400 dark:border-gray-600 shadow-md bg-gray-50 dark:bg-gray-800"
          : "border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900"
      }`}
      role="listitem"
      aria-label={`${dayGoal.day} goals: ${dayGoal.completedCount} of ${dayGoal.totalCount} goals completed`}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${today ? "bg-gray-800 dark:bg-gray-200" : "bg-gray-200 dark:bg-gray-700"}`} aria-hidden="true">
              <Sparkles className={`h-4 w-4 ${today ? "text-white dark:text-gray-900" : "text-gray-700 dark:text-gray-300"}`} />
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${today ? "text-gray-900 dark:text-gray-100" : "text-gray-800 dark:text-gray-200"}`}>
                {dayGoal.day}
                {today && (
                  <span className="ml-2 text-xs bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">{formatDateDisplay(dayGoal.date)}</p>
            </div>
          </div>

          <Badge
            variant={isDayComplete ? "default" : "outline"}
            className={
              isDayComplete
                ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            }
            aria-label={`${dayGoal.completedCount} of ${dayGoal.totalCount} goals completed`}
          >
            {dayGoal.completedCount}/{dayGoal.totalCount} completed
          </Badge>
        </div>

        {dayGoal.totalCount > 0 && (
          <Progress
            value={(dayGoal.completedCount / dayGoal.totalCount) * 100}
            className="h-2 mb-4 bg-gray-200 dark:bg-gray-700"
            aria-label={`Progress: ${Math.round((dayGoal.completedCount / dayGoal.totalCount) * 100)}%`}
          />
        )}

        {dayGoal.tasks.length > 0 ? (
          <ul className="space-y-2" role="list" aria-label={`Goals for ${dayGoal.day}`}>
            {dayGoal.tasks.map((goal: any) => (
              <li
                key={goal.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  goal.status === "completed" || goal.status === "Completed"
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <span
                  className={`shrink-0 ${
                    goal.status === "completed" || goal.status === "Completed"
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                  aria-hidden="true"
                >
                  {goal.status === "completed" || goal.status === "Completed" ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </span>
                <span
                  className={`flex-1 text-sm ${
                    goal.status === "completed" || goal.status === "Completed"
                      ? "text-gray-500 dark:text-gray-500 line-through"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {goal.title}
                </span>
                {(goal.status === "completed" || goal.status === "Completed") && (
                  <span className="text-xs text-gray-500 dark:text-gray-500" aria-label="Goal completed">
                    Done
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-500" role="status" aria-label={`No goals for ${dayGoal.day}`}>
            <p className="text-sm">No goals for this day</p>
            <p className="text-xs mt-1">Add goals to see them here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
