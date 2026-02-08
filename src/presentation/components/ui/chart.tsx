"use client";

import { forwardRef } from "react";

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: Record<string, { label?: string; color?: string }>;
}

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, children, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { config, ...restProps } = props as any;
    return (
      <div
        ref={ref}
        className={`aspect-video w-full ${className || ""}`}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

ChartContainer.displayName = "ChartContainer";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-gray-900 border-gray-700 px-3 py-2 text-white shadow-lg">
        <div className="grid grid-cols-1 gap-2">
          <div className="font-medium">{label}</div>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}: {entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  return <ChartTooltip active={active} payload={payload} label={label} />;
}