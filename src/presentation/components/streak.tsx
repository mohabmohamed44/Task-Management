import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/presentation/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { GitHubStreakProps } from "@/domain/entities/stats";

export const GitHubStreak = ({ data, isLoading = false }: GitHubStreakProps & { isLoading?: boolean }) => {
  const getColorClass = (count: number) => {
    if (count == 0) return "bg-muted";
    if (count < 3) return "bg-green-900";
    if (count < 6) return "bg-green-700";
    if (count < 9) return "bg-green-500";
    
    return "bg-green-300"
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Activity Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-sm bg-muted animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Activity Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No activity data available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Activity Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          <TooltipProvider>
            {data.map((day) => (
              <Tooltip key={day.date}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "w-3 h-3 rounded-xs transition-colors",
                      getColorClass(day.count)
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {day.count} tasks on {new Date(day.date).toLocaleDateString()}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="w-3 h-3 rounded-xs bg-muted"></div>
          <div className="w-3 h-3 rounded-xs bg-green-900"></div>
          <div className="w-3 h-3 rounded-xs bg-green-700"></div>
          <div className="w-3 h-3 rounded-xs bg-green-500"></div>
          <div className="w-3 h-3 rounded-xs bg-green-300"></div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}