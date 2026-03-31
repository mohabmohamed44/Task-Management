import { useTasksQuery } from "@/app/Queries/task.query";
import { useMemo } from "react";
import type { GetTaskQueryDTO } from "@/domain/entities/get-tasks-query.dto";
import { AlertCircle } from "lucide-react";
import TaskChart from "@/presentation/components/TaskChart";
import { Button } from "@/presentation/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import MetaData from "../components/MetaData";

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
    const tasks = data?.tasks || [];
    // const completedCount = tasks.filter((t) => t.completed).length;
    // const pendingCount = tasks.filter((t) => !t.completed).length;
    // const urgentCount = tasks.filter(
    //     (t) => t.priority === TaskPriority.Urgent
    // ).length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-border"></div>
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-t-primary absolute top-0"></div>
                    </div>
                    <p className="text-muted-foreground font-medium text-sm sm:text-base">Loading statistics...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="bg-destructive/10 p-4 sm:p-6 rounded-full w-fit mx-auto">
                        <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-destructive" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">Error loading statistics</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">Unable to load task statistics. Please try again.</p>
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
            title="Statistics"
            description="Manage and track your Statistics and Productivity here"
            type = "website"
            path="/statistics"
            noIndex
         />
        <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 lg:p-8 dark:selection:bg-gray-600 dark:selection:text-gray-300 selection:bg-black selection:text-white">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate('/tasks')}
                        className="hover:bg-secondary self-start"
                    >
                        <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Task Statistics</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">View comprehensive analytics and insights about your tasks</p>
                    </div>
                </div>

                {/* Task Chart Component */}
                <TaskChart tasks={tasks} />

                {/* Summary Statistics Cards */}
            </div>
        </div>
        </>
    );
}
