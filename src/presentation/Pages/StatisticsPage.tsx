import { lazy, Suspense, useMemo } from "react";
import { useTasksQuery } from "@/app/Queries/task.query";
import type { GetTaskQueryDTO } from "@/domain/entities/get-tasks-query.dto";
import { AlertCircle, ArrowLeft, BarChart3, RefreshCcw } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { useNavigate } from "react-router";
import MetaData from "../components/MetaData";
import type { ContributionDay } from "@/domain/entities/stats";

const TaskChart = lazy(() => import("@/presentation/components/TaskChart"));
const GitHubStreak = lazy(() =>
    import("../components/streak").then(({ GitHubStreak }) => ({ default: GitHubStreak }))
);

export default function StatisticsPage() {
    const navigate = useNavigate();
    
    const query = useMemo<GetTaskQueryDTO>(
        () => ({
            page: 1,
            limit: 100,
            sort: "createdAt",
            order: "desc",
        }),
        []
    );

    const {  data,isLoading, isError, refetch } = useTasksQuery(query);
    const tasks = useMemo(() => data?.tasks || [], [data]);

    // Compute contributions (last 365 days) from tasks client-side
    const contributions = useMemo<ContributionDay[]>(() => {
        const days: ContributionDay[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Pre-compute timestamps for fast lookups
        const completedDates = tasks
            .filter((t) => t.completed)
            .map((t) => {
                const d = new Date(t.updatedAt);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            });

        const createdDates = tasks.map((t) => {
            const d = new Date(t.createdAt);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        });

        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const dateStr = `${year}-${month}-${day}`;
            const targetTime = date.getTime();

            // Count tasks completed on this day (using updatedAt for completed tasks)
            // plus tasks created on this day
            const completedOnDay = completedDates.filter((time) => time === targetTime).length;
            const createdOnDay = createdDates.filter((time) => time === targetTime).length;

            days.push({
                date: dateStr,
                count: completedOnDay + createdOnDay,
            });
        }
        return days;
    }, [tasks]);

    if (isLoading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-black dark:border-t-white absolute top-0"></div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Loading analytics...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full w-fit mx-auto">
                        <AlertCircle className="h-16 w-16 text-gray-900 dark:text-gray-100" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error loading analytics</h3>
                    <p className="text-gray-500 dark:text-gray-400">Unable to load task statistics. Please try again.</p>
                    <Button 
                        variant="outline" 
                        onClick={() => refetch()}
                        name="retry"
                        id="retry"
                        aria-label="Retry"
                        aria-required="true"
                        aria-invalid={false}
                        aria-describedby="retry-error"
                        aria-pressed={false}
                        >
                        <RefreshCcw className="h-5 w-5" />
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
         <MetaData
            title="Analytics"
            description="Monitor your task performance and productivity trends"
            type = "website"
            path="/statistics"
            noIndex={false}
         />
        <div className="min-h-screen p-4 md:p-6 lg:p-8 selection:text-white selection:bg-gray-900 dark:selection:bg-white dark:selection:text-gray-900">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8 md:mb-10">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/tasks')}
                            aria-label="Back to tasks"
                            aria-required="true"
                            aria-invalid={false}
                            aria-describedby="back-to-tasks-error"
                            aria-pressed={false}
                            name="back-to-tasks"
                            id="back-to-tasks"
                            className="-ml-2 shrink-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-gray-900 p-3 text-white dark:bg-gray-100 dark:text-gray-900" aria-hidden="true">
                                <BarChart3 className="h-7 w-7" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Analytics</h1>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">Monitor your task performance and productivity trends</p>
                            </div>
                        </div>
                    </div>
                </header>

                <Suspense fallback={<div className="min-h-96" role="status" aria-label="Loading analytics charts" />}>
                    <TaskChart tasks={tasks} />

                    <div className="mt-8 md:mt-10">
                        <GitHubStreak data={contributions} isLoading={isLoading} />
                    </div>
                </Suspense>
            </div>
        </div>
        </>
    );
}
