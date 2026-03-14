import { useState, useMemo } from "react";
import {
  Target,
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Clock,
  BarChart3,
  Sparkles,
  Plus,
  Filter,
  Search,
  Flag,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";
import { Button } from "@/presentation/components/Button";
import { Badge } from "@/presentation/components/ui/badge";
import { Separator } from "@/presentation/components/ui/separator";
import { Input } from "@/presentation/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import { Label } from "@/presentation/components/ui/label";
import { Textarea } from "@/presentation/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { useTasksQuery } from "@/app/Queries/task.query";
import type { Task } from "@/domain/entities/task.entity";
import { format, startOfWeek, addDays, isSameDay, parseISO, addWeeks } from "date-fns";
import MetaData from "../components/MetaData";

// Days of the week
const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Sample weekly goals data (design only)
const SAMPLE_WEEKLY_GOALS = [
  { id: 1, title: "Complete project proposal", description: "Finish the Q2 project proposal document", completed: true, priority: "high", dueDate: "2026-03-10" },
  { id: 2, title: "Review team deliverables", description: "Review and approve all team deliverables for sprint", completed: false, priority: "medium", dueDate: "2026-03-12" },
  { id: 3, title: "Client meeting preparation", description: "Prepare slides and agenda for client meeting", completed: false, priority: "high", dueDate: "2026-03-14" },
  { id: 4, title: "Update documentation", description: "Update API documentation with new endpoints", completed: false, priority: "low", dueDate: "2026-03-15" },
];

interface DayGoal {
  day: string;
  date: Date;
  tasks: Task[];
  completedCount: number;
  totalCount: number;
}

interface WeeklyGoal {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  dueDate: string;
}

// Priority colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900";
    case "medium":
      return "bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900";
    case "low":
      return "bg-gray-400 dark:bg-gray-600 text-white dark:text-gray-100";
    default:
      return "bg-gray-500 text-white";
  }
};

export default function WeeklyGoals() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(SAMPLE_WEEKLY_GOALS);

  // Fetch tasks
  const { data, isLoading } = useTasksQuery({});
  const tasks = data?.tasks || [];

  // Calculate the current week's start date
  const currentWeekStart = useMemo(() => {
    const today = new Date();
    return startOfWeek(addWeeks(today, currentWeekOffset), { weekStartsOn: 0 });
  }, [currentWeekOffset]);

  // Generate days of the week
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  // Organize tasks by day
  const weeklyGoalsByDay = useMemo(() => {
    return weekDays.map((day) => {
      const dayTasks = tasks.filter((task: Task) => {
        if (!task.dueDate) return false;
        const taskDate = task.dueDate instanceof Date ? task.dueDate : parseISO(String(task.dueDate));
        return isSameDay(taskDate, day);
      });

      const completedCount = dayTasks.filter((t: Task) => t.completed).length;
      const totalCount = dayTasks.length;

      return {
        day: DAYS_OF_WEEK[day.getDay()],
        date: day,
        tasks: dayTasks,
        completedCount,
        totalCount,
      } as DayGoal;
    });
  }, [weekDays, tasks]);

  // Calculate weekly statistics (from tasks)
  const weeklyStats = useMemo(() => {
    const totalTasks = weeklyGoalsByDay.reduce((acc, day) => acc + day.totalCount, 0);
    const completedTasks = weeklyGoalsByDay.reduce((acc, day) => acc + day.completedCount, 0);
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const daysWithTasks = weeklyGoalsByDay.filter((day) => day.totalCount > 0).length;

    return {
      totalTasks,
      completedTasks,
      completionRate,
      daysWithTasks,
    };
  }, [weeklyGoalsByDay]);

  // Calculate weekly goals stats
  const goalsStats = useMemo(() => {
    const total = weeklyGoals.length;
    const completed = weeklyGoals.filter((g) => g.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, rate };
  }, [weeklyGoals]);

  // Filter weekly goals
  const filteredGoals = useMemo(() => {
    let filtered = weeklyGoals;

    // Filter by status
    if (filterStatus === "completed") {
      filtered = filtered.filter((g) => g.completed);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((g) => !g.completed);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (g) =>
          g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [weeklyGoals, filterStatus, searchQuery]);

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekOffset((prev) => prev - 1);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekOffset((prev) => prev + 1);
  };

  // Navigate to current week
  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  // Format date for display
  const formatDateDisplay = (date: Date) => {
    return format(date, "MMM d");
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  // Toggle goal completion
  const toggleGoalCompletion = (goalId: number) => {
    setWeeklyGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  return (
    <>
    <MetaData
      title="Weekly Goals"
      description="Track and Manage your goals effeciently"
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
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className="p-3 bg-gray-200 dark:bg-gray-800 rounded-xl shadow-sm"
                aria-hidden="true"
              >
                <Target className="h-7 w-7 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Weekly Goals
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg">
                  Track your progress and achieve your weekly objectives
                </p>
              </div>
            </div>

            {/* Week Navigation */}
            <div
              className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-1"
              role="navigation"
              aria-label="Week navigation"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousWeek}
                aria-label="Go to previous week"
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                onClick={goToCurrentWeek}
                aria-label="Go to current week"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3"
              >
                This Week
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextWeek}
                aria-label="Go to next week"
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Current Week Date Range */}
          <div
            className="mt-4 flex items-center gap-2 text-gray-600 dark:text-gray-400"
            aria-live="polite"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatDateDisplay(weekDays[0])} - {formatDateDisplay(weekDays[6])}, {format(weekDays[0], "yyyy")}
            </span>
          </div>
        </header>

        {/* Stats Overview Cards */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          aria-label="Weekly statistics"
        >
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <BarChart3 className="h-4 w-4" />
                Total Tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {weeklyStats.totalTasks}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Across {weeklyStats.daysWithTasks} days
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4" />
                Completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {weeklyStats.completedTasks}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Tasks done this week
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <TrendingUp className="h-4 w-4" />
                Completion Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {weeklyStats.completionRate}%
              </div>
              <Progress
                value={weeklyStats.completionRate}
                className="mt-2 h-2 bg-gray-200 dark:bg-gray-700"
                aria-label={`Completion rate: ${weeklyStats.completionRate}%`}
              />
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                Remaining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {weeklyStats.totalTasks - weeklyStats.completedTasks}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Tasks to complete
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Goals of the Week Section */}
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
                  {/* Filter Dropdown */}
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger
                      className="w-32.5 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                      aria-label="Filter goals"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900">
                      <SelectGroup>
                        <SelectLabel>Filter</SelectLabel>
                        <SelectItem value="all">All Goals</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectGroup>  
                    </SelectContent>
                  </Select>

                  {/* Add Goal Modal */}
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
                        aria-label="Add new goal"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Goal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-gray-100">
                          Add New Goal
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                          Set a new goal for this week
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="goal-title"
                            className="text-gray-700 dark:text-gray-300"
                          >
                            Goal Title
                          </Label>
                          <Input
                            id="goal-title"
                            placeholder="Enter your goal title"
                            className="border-gray-300 dark:border-gray-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="goal-description"
                            className="text-gray-700 dark:text-gray-300"
                          >
                            Description
                          </Label>
                          <Textarea
                            id="goal-description"
                            placeholder="Describe your goal"
                            className="border-gray-300 dark:border-gray-700"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="goal-priority"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Priority
                            </Label>
                            <Select>
                              <SelectTrigger
                                id="goal-priority"
                                className="border-gray-300 dark:border-gray-700"
                              >
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-900">
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="goal-due-date"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Due Date
                            </Label>
                            <Input
                              id="goal-due-date"
                              type="date"
                              className="border-gray-300 dark:border-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsModalOpen(false)}
                          className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Add Goal
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-4">
                <div className="relative max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    placeholder="Search goals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                    aria-label="Search goals"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Goals Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Goals:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{goalsStats.total}</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-gray-300 dark:bg-gray-700" />
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
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

              {/* Goals List */}
              <div className="space-y-3">
                {filteredGoals.length > 0 ? (
                  filteredGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                        goal.completed
                          ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 p-0 mt-0.5 shrink-0"
                        onClick={() => toggleGoalCompletion(goal.id)}
                        aria-label={goal.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {goal.completed ? (
                          <CheckCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </Button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4
                              className={`font-medium ${
                                goal.completed
                                  ? "text-gray-500 dark:text-gray-500 line-through"
                                  : "text-gray-900 dark:text-gray-100"
                              }`}
                            >
                              {goal.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
                              {goal.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              aria-label="Edit goal"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              aria-label="Delete goal"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge
                            className={`text-xs ${getPriorityColor(goal.priority)}`}
                            aria-label={`Priority: ${goal.priority}`}
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            {goal.priority}
                          </Badge>
                          <div
                            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500"
                            aria-label={`Due: ${goal.dueDate}`}
                          >
                            <Calendar className="h-3 w-3" />
                            {format(parseISO(goal.dueDate), "MMM d, yyyy")}
                          </div>
                          {goal.completed && (
                            <Badge
                              variant="outline"
                              className="text-xs border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                            >
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-500">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No goals found</p>
                    <p className="text-sm mt-1">Add a new goal to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Progress Card */}
          <Card className="lg:col-span-1 border border-gray-200 dark:border-gray-800 shadow bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
                <Sparkles className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                Weekly Progress
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Your overall progress this week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Circular Progress */}
              <div className="flex justify-center">
                <div
                  className="relative w-32 h-32"
                  role="img"
                  aria-label={`Weekly completion: ${weeklyStats.completionRate}%`}
                >
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      className="text-gray-200 dark:text-gray-700"
                      strokeWidth="12"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      className="text-gray-800 dark:text-gray-200 transition-all duration-500"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${weeklyStats.completionRate * 2.64} 264`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {weeklyStats.completionRate}%
                    </span>
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
                            isToday(dayGoal.date)
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {dayGoal.day.slice(0, 3)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {formatDateDisplay(dayGoal.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={dayGoal.totalCount > 0 ? (dayGoal.completedCount / dayGoal.totalCount) * 100 : 0}
                          className="w-16 h-2 bg-gray-200 dark:bg-gray-700"
                          aria-label={`${dayGoal.day} progress: ${dayGoal.completedCount} of ${dayGoal.totalCount} tasks completed`}
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

          {/* Daily Goals Cards */}
          <div className="lg:col-span-2 space-y-4" role="list" aria-label="Daily goals">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Daily Goals
            </h2>

            {isLoading ? (
              Array.from({ length: 7 }).map((_, i) => (
                <Card
                  key={i}
                  className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 animate-pulse"
                  aria-hidden="true"
                >
                  <CardContent className="p-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                  </CardContent>
                </Card>
              ))
            ) : (
              weeklyGoalsByDay.map((dayGoal, index) => (
                <Card
                  key={index}
                  className={`border transition-all duration-200 ${
                    isToday(dayGoal.date)
                      ? "border-gray-400 dark:border-gray-600 shadow-md bg-gray-50 dark:bg-gray-800"
                      : "border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900"
                  }`}
                  role="listitem"
                  aria-label={`${dayGoal.day} goals: ${dayGoal.completedCount} of ${dayGoal.totalCount} tasks completed`}
                >
                  <CardContent className="p-4 md:p-6">
                    {/* Day Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isToday(dayGoal.date)
                              ? "bg-gray-800 dark:bg-gray-200"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                          aria-hidden="true"
                        >
                          {isToday(dayGoal.date) ? (
                            <Sparkles className="h-4 w-4 text-white dark:text-gray-900" />
                          ) : (
                            <Calendar className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          )}
                        </div>
                        <div>
                          <h3
                            className={`font-semibold text-lg ${
                              isToday(dayGoal.date)
                                ? "text-gray-900 dark:text-gray-100"
                                : "text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {dayGoal.day}
                            {isToday(dayGoal.date) && (
                              <span className="ml-2 text-xs bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 px-2 py-0.5 rounded-full">
                                Today
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {formatDateDisplay(dayGoal.date)}
                          </p>
                        </div>
                      </div>

                      {/* Progress Badge */}
                      <Badge
                        variant={dayGoal.completedCount === dayGoal.totalCount && dayGoal.totalCount > 0 ? "default" : "outline"}
                        className={`${
                          dayGoal.completedCount === dayGoal.totalCount && dayGoal.totalCount > 0
                            ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                            : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                        aria-label={`${dayGoal.completedCount} of ${dayGoal.totalCount} tasks completed`}
                      >
                        {dayGoal.completedCount}/{dayGoal.totalCount} completed
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    {dayGoal.totalCount > 0 && (
                      <Progress
                        value={(dayGoal.completedCount / dayGoal.totalCount) * 100}
                        className="h-2 mb-4 bg-gray-200 dark:bg-gray-700"
                        aria-label={`Progress: ${Math.round((dayGoal.completedCount / dayGoal.totalCount) * 100)}%`}
                      />
                    )}

                    {/* Tasks List */}
                    {dayGoal.tasks.length > 0 ? (
                      <ul className="space-y-2" role="list" aria-label={`Tasks for ${dayGoal.day}`}>
                        {dayGoal.tasks.map((task) => (
                          <li
                            key={task.id}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                              task.completed
                                ? "bg-gray-100 dark:bg-gray-800"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            }`}
                          >
                            <span
                              className={`shrink-0 ${task.completed ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-600"}`}
                              aria-hidden="true"
                            >
                              {task.completed ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <Circle className="h-5 w-5" />
                              )}
                            </span>
                            <span
                              className={`flex-1 text-sm ${
                                task.completed
                                  ? "text-gray-500 dark:text-gray-500 line-through"
                                  : "text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.completed && (
                              <span className="text-xs text-gray-500 dark:text-gray-500" aria-label="Task completed">
                                Done
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div
                        className="text-center py-6 text-gray-500 dark:text-gray-500"
                        role="status"
                        aria-label={`No tasks scheduled for ${dayGoal.day}`}
                      >
                        <p className="text-sm">No tasks scheduled for this day</p>
                        <p className="text-xs mt-1">Add tasks with due dates to see them here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
