import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/presentation/components/ui/tooltip"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import type { GitHubStreakProps } from "@/domain/entities/stats";

interface WeekColumn {
  date: string;
  count: number;
}

const CELL_SIZE = 12;
const CELL_GAP = 4;

const LEVELS = [
  "bg-gray-100 dark:bg-gray-800",
  "bg-gray-300 dark:bg-gray-600",
  "bg-gray-500 dark:bg-gray-400",
  "bg-gray-700 dark:bg-gray-300",
  "bg-gray-900 dark:bg-gray-100",
];

const getLevel = (count: number) => {
  if (count <= 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 9) return 3;
  return 4;
};

const pad = (n: number) => String(n).padStart(2, "0");
const formatKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function buildGrid(data: GitHubStreakProps["data"]): WeekColumn[][] {
  const countByDate = new Map(data.map((d) => [d.date, d.count]));

  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(end.getDate() - (data.length - 1));

  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - start.getDay());

  const weeks: WeekColumn[][] = [];
  const cursor = new Date(gridStart);

  while (cursor <= end) {
    const week: WeekColumn[] = [];
    for (let i = 0; i < 7; i++) {
      const key = formatKey(cursor);
      week.push({ date: key, count: countByDate.get(key) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

function monthLabels(weeks: WeekColumn[][]): { label: string; index: number }[] {
  const labels: { label: string; index: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, index) => {
    const d = new Date(`${week[0].date}T00:00:00`);
    const month = d.getMonth();
    if (month !== lastMonth) {
      labels.push({ label: d.toLocaleDateString("en-US", { month: "short" }), index });
      lastMonth = month;
    }
  });

  return labels;
}

function computeStreaks(data: GitHubStreakProps["data"]) {
  let current = 0;
  let longest = 0;
  let running = 0;

  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].count > 0) current++;
    else break;
  }

  for (const day of data) {
    if (day.count > 0) {
      running++;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }

  return { current, longest };
}

export const GitHubStreak = ({ data, isLoading = false }: GitHubStreakProps & { isLoading?: boolean }) => {
  const weeks = useMemo(() => (data?.length ? buildGrid(data) : []), [data]);
  const labels = useMemo(() => monthLabels(weeks), [weeks]);
  const streaks = useMemo(() => (data?.length ? computeStreaks(data) : { current: 0, longest: 0 }), [data]);

  const activeDays = data?.filter((d) => d.count > 0).length ?? 0;
  const totalContributions = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  const stats = [
    { label: "Current Streak", value: streaks.current, suffix: "d" },
    { label: "Longest Streak", value: streaks.longest, suffix: "d" },
    { label: "Active Days", value: activeDays, suffix: "" },
    { label: "Contributions", value: totalContributions, suffix: "" },
  ];

  return (
    <Card className="w-full border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <CardHeader className="px-5 pb-2 pt-5">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-gray-900 dark:text-gray-100" />
          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="h-4 w-2/3" />
                  <div className="mt-2 h-6 w-10" />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 84 }).map((_, i) => (
                <div key={i} className="h-3 w-3 rounded-xs bg-gray-100 animate-pulse dark:bg-gray-800" />
              ))}
            </div>
          </div>
        ) : !data || data.length === 0 ? (
          <p className="py-4 text-sm text-gray-500 dark:text-gray-400">No activity data available.</p>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {stat.value}
                    {stat.suffix && <span className="ml-0.5 text-sm font-medium text-gray-400 dark:text-gray-500">{stat.suffix}</span>}
                  </p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto pb-1">
              <div className="min-w-max">
                <div className="relative mb-1 h-4">
                  {labels.map(({ label, index }) => (
                    <span
                      key={label}
                      className="absolute top-0 whitespace-nowrap text-[10px] text-gray-400 dark:text-gray-500"
                      style={{ left: index * (CELL_SIZE + CELL_GAP) }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div className="grid grid-rows-7 grid-flow-col gap-1">
                  <TooltipProvider>
                    {weeks.flat().map((day, index) => (
                      <Tooltip key={`${day.date}-${index}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn("h-3 w-3 rounded-xs transition-colors", LEVELS[getLevel(day.count)])}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {day.count} tasks on {new Date(`${day.date}T00:00:00`).toLocaleDateString()}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
                  <span>Less</span>
                  {LEVELS.map((level) => (
                    <div key={level} className={cn("h-3 w-3 rounded-xs", level)} />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
