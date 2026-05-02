"use client";

import { isSameDay } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/presentation/components/ui/chart"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { AlertCircle, CheckCircle2, ListTodo, TrendingUp } from "lucide-react"
import { useMemo } from "react"
import type { Task } from "@/domain/entities/task.entity"
import { TaskPriority } from "@/domain/enums/task-priority.enum"

interface TaskChartProps {
  tasks: Task[];
}

export default function TaskChart({ tasks }: TaskChartProps) {
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const urgentTasks = tasks.filter(
    (t) => t.priority === TaskPriority.Urgent
  ).length;

  // Task priority distribution data
  const priorityData = useMemo(() => [
    { priority: "Urgent", count: urgentTasks, color: "#dc2626" },
    { priority: "High", count: tasks.filter(task => task.priority === TaskPriority.High).length, color: "#ea580c" },
    { priority: "Medium", count: tasks.filter(task => task.priority === TaskPriority.Medium).length, color: "#ca8a04" },
    { priority: "Low", count: tasks.filter(task => task.priority === TaskPriority.Low).length, color: "#16a34a" },
  ], [tasks, urgentTasks]);

  // Task completion status data
  const statusData = useMemo(() => [
    { status: "Completed", count: completedTasks, color: "#16a34a" },
    { status: "Pending", count: pendingTasks, color: "#2563eb" },
  ], [completedTasks, pendingTasks]);

  // Weekly task creation data
  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    return days.map((day, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - index));
      
      const createdTasks = tasks.filter(task => {
        return isSameDay(new Date(task.createdAt), date);
      });

      return {
        day,
        created: createdTasks.length,
        completed: tasks.filter(task => {
          if (!task.completed) return false;
          return isSameDay(new Date(task.updatedAt), date);
        }).length
      };
    });
  }, [tasks]);

  // Monthly task trends - using actual data aggregation
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      // Get the month number (1-12)
      const monthNum = index + 1;
      
      // Filter tasks created in this month
      const createdInMonth = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.getFullYear() === currentYear && taskDate.getMonth() === monthNum - 1;
      });
      
      // Filter tasks completed in this month
      const completedInMonth = tasks.filter(task => {
        if (!task.completed) return false;
        const taskUpdatedDate = new Date(task.updatedAt);
        return taskUpdatedDate.getFullYear() === currentYear && taskUpdatedDate.getMonth() === monthNum - 1;
      });
      
      return {
        month,
        created: createdInMonth.length,
        completed: completedInMonth.length,
      };
    });
  }, [tasks]);

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 lg:p-8 dark:selection:bg-gray-600 dark:selection:text-gray-300">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-7">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border shadow hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Tasks
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {totalTasks}
                  </p>
                </div>
                <div className="bg-blue-500/10 p-2 sm:p-3 md:p-4 rounded-xl">
                  <ListTodo className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                    Completed
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                    {completedTasks}
                  </p>
                </div>
                <div className="bg-green-500/10 p-2 sm:p-3 md:p-4 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                    Pending
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {pendingTasks}
                  </p>
                </div>
                <div className="bg-orange-500/10 p-2 sm:p-3 md:p-4 rounded-xl">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                    Urgent
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">
                    {urgentTasks}
                  </p>
                </div>
                <div className="bg-red-500/10 p-2 sm:p-3 md:p-4 rounded-xl">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Priority Distribution Pie Chart */}
        <Card className="border shadow hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-foreground text-base sm:text-lg">Priority Distribution</CardTitle>
            <CardDescription className="text-muted-foreground text-xs sm:text-sm">Tasks breakdown by priority level</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ChartContainer
              config={{
                urgent: {
                  label: "Urgent",
                  color: "#dc2626",
                },
                high: {
                  label: "High",
                  color: "#ea580c",
                },
                medium: {
                  label: "Medium",
                  color: "#ca8a04",
                },
                low: {
                  label: "Low",
                  color: "#16a34a",
                },
              }}
              className="h-64 sm:h-72 md:h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={false}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="text-sm font-medium text-foreground">{data.priority}</p>
                            <p className="text-xs text-muted-foreground">{data.count} tasks</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status Count Bar Chart */}
        <Card className="border shadow hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-foreground text-base sm:text-lg">Task Status</CardTitle>
            <CardDescription className="text-muted-foreground text-xs sm:text-sm">Number of tasks by completion status</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ChartContainer
              config={{
                count: {
                  label: "Tasks",
                  color: "#3b82f6",
                },
              }}
              className="h-64 sm:h-72 md:h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="status" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Task Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Weekly Activity Bar Chart */}
        <Card className="border shadow hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-foreground text-base sm:text-lg">Weekly Activity</CardTitle>
            <CardDescription className="text-muted-foreground text-xs sm:text-sm">Tasks created vs completed this week</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ChartContainer
              config={{
                created: {
                  label: "Created",
                  color: "#2563eb",
                },
                completed: {
                  label: "Completed",
                  color: "#16a34a",
                },
              }}
              className="h-64 sm:h-72 md:h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="created" fill="#2563eb" name="Created" />
                  <Bar dataKey="completed" fill="#16a34a" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Task Trend */}
        <Card className="border shadow hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-foreground text-base sm:text-lg">Monthly Trends</CardTitle>
            <CardDescription className="text-muted-foreground text-xs sm:text-sm">Task creation trends over time</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ChartContainer
              config={{
                created: {
                  label: "Tasks Created",
                  color: "#8b5cf6",
                },
              }}
              className="h-64 sm:h-72 md:h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="created"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Priority Summary Table */}
      <Card className="border shadow hover:shadow-xl transition-all hover:-translate-y-1">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-foreground text-base sm:text-lg">Priority Summary</CardTitle>
          <CardDescription className="text-muted-foreground text-xs sm:text-sm">Detailed breakdown of task priorities</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full min-w-125 sm:min-w-0">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-muted-foreground text-xs sm:text-sm font-medium">Priority</th>
                  <th className="text-right p-2 text-muted-foreground text-xs sm:text-sm font-medium">Count</th>
                  <th className="text-right p-2 text-muted-foreground text-xs sm:text-sm font-medium hidden sm:table-cell">%</th>
                  <th className="text-right p-2 text-muted-foreground text-xs sm:text-sm font-medium hidden md:table-cell">Done</th>
                  <th className="text-right p-2 text-muted-foreground text-xs sm:text-sm font-medium">Rate</th>
                </tr>
              </thead>
              <tbody>
                {priorityData.map((item, index) => {
                  const priorityTasks = tasks.filter(task => {
                    const priorityMap = {
                      "Urgent": TaskPriority.Urgent,
                      "High": TaskPriority.High,
                      "Medium": TaskPriority.Medium,
                      "Low": TaskPriority.Low
                    };
                    return task.priority === priorityMap[item.priority as keyof typeof priorityMap];
                  });
                  const completedInPriority = priorityTasks.filter(t => t.completed).length;
                  const completionRate = item.count > 0 ? Math.round((completedInPriority / item.count) * 100) : 0;
                  
                  return (
                    <tr key={index} className="border-b border-border/50">
                      <td className="p-2 text-foreground text-xs sm:text-sm font-medium">{item.priority}</td>
                      <td className="text-right p-2 text-foreground text-xs sm:text-sm">{item.count}</td>
                      <td className="text-right p-2 text-foreground text-xs sm:text-sm hidden sm:table-cell">{Math.round((item.count / totalTasks) * 100)}%</td>
                      <td className="text-right p-2 text-foreground text-xs sm:text-sm hidden md:table-cell">{completedInPriority}</td>
                      <td className="text-right p-2 text-foreground text-xs sm:text-sm">{completionRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
