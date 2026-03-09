import { useTasksQuery } from "@/app/Queries/task.query";
import { useMemo, useState } from "react";
import type { GetTaskQueryDTO } from "@/domain/entities/get-tasks-query.dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { getPriorityIconName } from "@/domain/utils/task-ui";
import { Link } from "react-router";
import Pagination from "@/presentation/components/pagination";
import { getPriorityColor } from "@/domain/utils/task-ui";
import {Button} from "@/presentation/components/Button";
import {AlertCircle, Calendar, CircleArrowRight, Clock } from "lucide-react"
import { formatDate } from "@/domain/utils/date";
import { ListTodo } from "lucide-react";
import MetaData from "../components/MetaData";

const TaskPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const query = useMemo<GetTaskQueryDTO>(() => ({
    page: currentPage,
    limit: 10,
    sort: "createdAt",
    order: "desc",
  }), [currentPage]);

  const { data, isLoading, error, refetch } = useTasksQuery(query);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-border"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-primary absolute top-0"></div>
              </div>
              <p className="text-muted-foreground font-medium">Loading your tasks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="bg-destructive/10 p-6 rounded-full">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Failed to load tasks</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
            </div>
            <button 
              onClick={() => refetch()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 font-medium shadow-lg shadow-primary/20"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tasks = data?.tasks || [];

  return (
    <>
    <MetaData
      title="Tasks"
      description="the Tasks Page where you see all of the tasks you created"
      path="/tasks"
      type="website"
    />
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-4">
            <div className="bg-linear-to-br from-primary to-primary/80 p-3 rounded-xl shadow-lg shadow-primary/20">
              <ListTodo className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">My Tasks</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track all your tasks in one place
              </p>
            </div>
          </div>
          <Button asChild className="w-full sm:w-auto flex items-center justify-center">
            <Link to="/create-task" className="flex items-center gap-2">
              Create a New Task
              <CircleArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <Card className="border shadow-lg">
            <CardContent className="p-16 text-center">
              <div className="bg-slate-100 p-6 rounded-full w-fit mx-auto mb-6">
                <ListTodo className="h-16 w-16 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">No tasks found</h3>
              <p className="text-muted-foreground">Create your first task to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card 
                key={task.id} 
                className={`border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <Link to={`/tasks/${task.id}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <CardTitle className={`text-lg font-semibold leading-tight ${
                        task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        {task.title}
                      </CardTitle>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Priority and Category */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-medium ${getPriorityColor(task.priority)} flex items-center gap-1.5 px-3 py-1`}
                    >
                      {getPriorityIconName(task.priority)}
                      {task.priority}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1"
                    >
                      {task.category}
                    </Badge>
                    {task.tags.length > 0 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1"
                      >
                        {task.tags.join(', ')}
                      </Badge>
                    )}
                  </div>
                  {/* Dates */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Due {formatDate(task.dueDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Created {formatDate(task.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="pt-4">
            <Pagination
              currentPage={data.meta.page}
              totalPages={data.meta.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default TaskPage;
