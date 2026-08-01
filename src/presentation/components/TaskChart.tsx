"use client";

import { isSameDay } from "date-fns";
import { useMemo } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/presentation/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { AlertCircle, CheckCircle2, Clock, ListTodo } from "lucide-react"
import type { Task } from "@/domain/entities/task.entity"
import { TaskPriority } from "@/domain/enums/task-priority.enum"

interface TaskChartProps {
  tasks: Task[];
}

const MONO = {
  1: "var(--mono-1)",
  2: "var(--mono-2)",
  3: "var(--mono-3)",
  4: "var(--mono-4)",
};

const AXIS_COLOR = "var(--muted-foreground)";
const GRID_COLOR = "var(--border)";

export default function TaskChart({ tasks }: TaskChartProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const urgentTasks = tasks.filter(
    (t) => t.priority === TaskPriority.Urgent
  ).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorityData = useMemo(() => [
    { priority: "Urgent", count: urgentTasks, color: MONO[1] },
    { priority: "High", count: tasks.filter(task => task.priority === TaskPriority.High).length, color: MONO[2] },
    { priority: "Medium", count: tasks.filter(task => task.priority === TaskPriority.Medium).length, color: MONO[3] },
    { priority: "Low", count: tasks.filter(task => task.priority === TaskPriority.Low).length, color: MONO[4] },
  ], [tasks, urgentTasks]);

  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    return days.map((day, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - index));

      return {
        day,
        created: tasks.filter(task => isSameDay(new Date(task.createdAt), date)).length,
        completed: tasks.filter(task => task.completed && isSameDay(new Date(task.updatedAt), date)).length,
      };
    });
  }, [tasks]);

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();

    return months.map((month, index) => ({
      month,
      created: tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.getFullYear() === currentYear && taskDate.getMonth() === index;
      }).length,
    }));
  }, [tasks]);

  const kpis = [
    { icon: <ListTodo className="h-5 w-5" />, label: "Total Tasks", value: totalTasks, subtext: "All tasks" },
    { icon: <CheckCircle2 className="h-5 w-5" />, label: "Completed", value: completedTasks, subtext: `${completionRate}% completion rate` },
    { icon: <Clock className="h-5 w-5" />, label: "Pending", value: pendingTasks, subtext: "Awaiting action" },
    { icon: <AlertCircle className="h-5 w-5" />, label: "Urgent", value: urgentTasks, subtext: "Requires attention" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <section aria-label="Task summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="flex items-start justify-between gap-4 px-5 py-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  {kpi.label}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {kpi.value}
                </p>
                <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-500">{kpi.subtext}</p>
              </div>
              <div className="shrink-0 rounded-lg bg-gray-100 p-2.5 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                {kpi.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section aria-label="Task charts" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <CardHeader className="px-5 pb-2 pt-5">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">Priority Distribution</CardTitle>
            <CardDescription className="text-xs text-gray-500 dark:text-gray-400">Tasks grouped by priority level</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="relative h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="count"
                    nameKey="priority"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={84}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PriorityTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{totalTasks}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">tasks</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {priorityData.map((item) => (
                <div key={item.priority} className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.priority}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <CardHeader className="px-5 pb-2 pt-5">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">Weekly Activity</CardTitle>
            <CardDescription className="text-xs text-gray-500 dark:text-gray-400">Tasks created vs completed this week</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <ChartContainer className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barGap={4}>
                  <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fill: AXIS_COLOR, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: AXIS_COLOR, fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="created" name="Created" fill={MONO[1]} radius={[3, 3, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="completed" name="Completed" fill={MONO[3]} radius={[3, 3, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: MONO[1] }} />
                Created
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: MONO[3] }} />
                Completed
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-label="Monthly trend">
        <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <CardHeader className="px-5 pb-2 pt-5">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">Monthly Trend</CardTitle>
            <CardDescription className="text-xs text-gray-500 dark:text-gray-400">Task creation over the current year</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <ChartContainer className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="monthlyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={MONO[1]} stopOpacity={0.14} />
                      <stop offset="100%" stopColor={MONO[1]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: AXIS_COLOR, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: AXIS_COLOR, fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--muted-foreground)" }} />
                  <Area
                    type="monotone"
                    dataKey="created"
                    name="Tasks created"
                    stroke={MONO[1]}
                    strokeWidth={2}
                    fill="url(#monthlyFill)"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section aria-label="Priority summary">
        <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <CardHeader className="px-5 pb-2 pt-5">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">Priority Summary</CardTitle>
            <CardDescription className="text-xs text-gray-500 dark:text-gray-400">Completion rate by priority level</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-105">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="pb-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Priority</th>
                    <th className="pb-2.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Tasks</th>
                    <th className="pb-2.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Share</th>
                    <th className="pb-2.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityData.map((item) => {
                    const priorityMap = {
                      "Urgent": TaskPriority.Urgent,
                      "High": TaskPriority.High,
                      "Medium": TaskPriority.Medium,
                      "Low": TaskPriority.Low,
                    };
                    const priorityTasks = tasks.filter(task => task.priority === priorityMap[item.priority as keyof typeof priorityMap]);
                    const done = priorityTasks.filter(t => t.completed).length;
                    const rate = item.count > 0 ? Math.round((done / item.count) * 100) : 0;
                    const share = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;

                    return (
                      <tr key={item.priority} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                        <td className="py-3 pr-4">
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.priority}</span>
                          </span>
                        </td>
                        <td className="py-3 text-right text-sm text-gray-600 dark:text-gray-400">{item.count}</td>
                        <td className="py-3 text-right text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{share}%</td>
                        <td className="py-3">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                              <div
                                className="h-full rounded-full bg-gray-900 dark:bg-gray-100"
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className="w-8 text-right text-xs font-semibold text-gray-900 dark:text-gray-100">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function PriorityTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <p className="font-medium text-gray-900 dark:text-gray-100">{data.priority}</p>
      <p className="text-gray-500 dark:text-gray-400">{data.count} tasks</p>
    </div>
  );
}
