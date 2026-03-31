"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/presentation/components/ui/chart";

export interface ChartDataItem {
  label: string;
  [key: string]: string | number;
}

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface StatsBarChartProps {
  title: string;
  description: string;
  data: ChartDataItem[];
  series: ChartSeries[];
  footerText?: string;
  trendText?: string;
  showTrend?: boolean;
  className?: string;
}

export function StatsBarChart({
  title,
  description,
  data,
  series,
  footerText = "Showing stats for the selected period",
  trendText,
  showTrend = false,
  className = "",
}: StatsBarChartProps) {
  // Build chart config from series
  const chartConfig = series.reduce((acc, s) => {
    acc[s.key] = {
      label: s.label,
      color: s.color,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card className={className}>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-gray-900 dark:text-gray-100 text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <ChartContainer config={chartConfig} className="h-48 sm:h-56 md:h-64 lg:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} accessibilityLayer margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tickFormatter={(value) =>
                  typeof value === "string" && value.length > 3
                    ? value.slice(0, 3)
                    : value
                }
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<ChartTooltipContent />} />
              {series.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  fill={s.color}
                  radius={[4, 4, 0, 0]}
                  name={s.label}
                  maxBarSize={50}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xs sm:text-sm p-4 sm:p-6">
        {showTrend && trendText && (
          <div className="flex gap-2 leading-none font-medium text-gray-700 dark:text-gray-300">
            {trendText} <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
        )}
        <div className="leading-none text-gray-500 dark:text-gray-500">
          {footerText}
        </div>
      </CardFooter>
    </Card>
  );
}

export default StatsBarChart;
