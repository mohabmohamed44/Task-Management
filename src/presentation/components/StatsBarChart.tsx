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
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">{title}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  typeof value === "string" && value.length > 3
                    ? value.slice(0, 3)
                    : value
                }
                stroke="var(--color-muted-foreground)"
              />
              <Tooltip content={<ChartTooltipContent />} />
              {series.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  fill={s.color}
                  radius={4}
                  name={s.label}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {showTrend && trendText && (
          <div className="flex gap-2 leading-none font-medium text-gray-700 dark:text-gray-300">
            {trendText} <TrendingUp className="h-4 w-4" />
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
