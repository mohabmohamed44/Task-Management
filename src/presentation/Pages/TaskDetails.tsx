import { useParams } from "react-router";
import { useTaskDetails } from "@/app/hooks/useTaskDetails";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Separator } from "@/presentation/components/ui/separator";
import { ArrowLeft, Calendar, Clock, AlertCircle, CheckCircle2, Tag, Layers, Download } from "lucide-react";
import { getPriorityIconName } from "@/domain/utils/task-ui";
import { formatDate } from "@/domain/utils/date";
import { getPriorityColor } from "@/domain/utils/task-ui";
import {TailSpin} from "react-loader-spinner";
import { Suspense, lazy } from "react";
import CommentsList from "../components/commentsList";
import { ExportModal } from "@/presentation/components/export/ExportModal";
import { useExportHandlers } from "@/presentation/hooks/useExportHandlers";
import { Attachments } from "@/presentation/components/attachments/Attachments";
import MetaData from "../components/MetaData";

const SubTaskList = lazy(() => import("@/presentation/components/SubTaskList"));

export default function TaskDetails() {
  const { id } = useParams();
  const {
    task,
    isLoading,
    error,
    toggleComplete,
    openUpdateModal,
    goBackToTasks,
    isUpdating,
  } = useTaskDetails(id);
  
  const { isExportModalOpen, openExportModal, closeExportModal } = useExportHandlers();


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-border"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-primary absolute top-0"></div>
          </div> 
          <p className="text-muted-foreground font-medium">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="bg-destructive/10 p-6 rounded-full w-fit mx-auto">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Task not found</h3>
          <p className="text-muted-foreground">The task you are looking for does not exist or an error occurred.</p>
          <Button onClick={goBackToTasks} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaData 
        title="Task Details"
        description="here you can see your task details, subtasks, comments, Attachments"
        type="website"
        path="/task/:id"
      />
      <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6 lg:p-8 selection:bg-black selection:text-white dark:selection:bg-gray-600 dark:selection:text-gray-300">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Header Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goBackToTasks}
              className="hover:bg-secondary self-start"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <div className="min-w-0 ml-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Task Details</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">View full information about this task</p>
            </div>
          </div>

          <Card className="border shadow-none">
            <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={task.completed ? "secondary" : "default"} className={`${task.completed ? "" : "bg-primary"} text-xs sm:text-sm`}>
                      {task.completed ? "Completed" : "In Progress"}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-medium ${getPriorityColor(task.priority)} flex items-center gap-1.5 px-2 sm:px-3 py-1`}
                    >
                      {getPriorityIconName(task.priority)}
                      {task.priority}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight wrap-break-word">
                    {task.title}
                  </CardTitle>
                </div>
                
                <div className="flex flex-row flex-nowrap items-center gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-2 rounded-lg border text-xs sm:text-sm shrink-0">
                    <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate leading-none">
                      {typeof task.category === 'object' && task.category !== null 
                        ? (task.category as any).name 
                        : task.category}
                    </span>
                  </div>
                  <Button variant="outline" onClick={openExportModal} size="sm" className="shrink-0">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant={"default"} onClick={openUpdateModal} size="sm" className="shrink-0">
                    Update Task
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="pt-3 sm:pt-6 space-y-4 sm:space-y-8 p-4 sm:p-6">
              {/* Description */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  Description
                </h3>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 sm:p-4 rounded-lg border text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {task.description || "No description provided."}
                </div>
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                    Tags
                  </h3>
                  <div className="flex flex-row gap-3 gap-y-3 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-3">
                    {task.tags.map((tag, index) => {
                      const tagText = typeof tag === 'object' && tag !== null 
                        ? (tag as any).name || (tag as any).id || JSON.stringify(tag)
                        : tag;
                      return (
                        <Badge key={index} variant="secondary" className="w-fit max-w-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium leading-none">
                          # {tagText}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              <Suspense fallback={<div>Loading SubTask Lists <span className="animate-bounce">...</span></div>}>
                  <SubTaskList taskId={task.id.toString()} />
              </Suspense>
              
              <Suspense 
                fallback={<div className="flex items-center justify-center">
                  <TailSpin />
                </div>}
              >
                <CommentsList taskId={task.id.toString()} />
              </Suspense>
              
              <Attachments taskId={task.id.toString()} />
              
              <Button 
                variant={task.completed ? "secondary" : "default"}
                onClick={() => toggleComplete()}
                disabled={isUpdating}
                className="pointer-cursor w-full sm:w-auto"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
              </Button>
            </CardContent>

            <Separator />

            <CardFooter className="bg-slate-50 dark:bg-slate-900/30 p-3 sm:p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatDate(task.dueDate)}
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Created At</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {formatDate(task.createdAt)}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Updated</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {formatDate(task.updatedAt)}
                </div>
              </div>
            </CardFooter>
          </Card>
          
          {/* Export Modal */}
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={closeExportModal}
            taskIds={task?.id ? [task.id] : undefined}
          />
        </div>
      </div>
    </>
  );
}
