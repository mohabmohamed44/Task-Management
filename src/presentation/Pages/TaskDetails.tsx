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
      <div className="min-h-screen bg-background p-6 selection:bg-black selection:text-white dark:selection:bg-gray-600 dark:selection:text-gray-300">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Navigation */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goBackToTasks}
              className="hover:bg-secondary"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Task Details</h1>
              <p className="text-sm text-muted-foreground">View full information about this task</p>
            </div>
          </div>

          <Card className="border shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={task.completed ? "secondary" : "default"} className={task.completed ? "" : "bg-primary"}>
                      {task.completed ? "Completed" : "In Progress"}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-medium ${getPriorityColor(task.priority)} flex items-center gap-1.5 px-3 py-1`}
                    >
                      {getPriorityIconName(task.priority)}
                      {task.priority} Priority
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold leading-tight">
                    {task.title}
                  </CardTitle>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-lg border">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {typeof task.category === 'object' && task.category !== null 
                        ? (task.category as any).name 
                        : task.category}
                    </span>
                  </div>
                  <Button variant="outline" onClick={openExportModal}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant={"default"} onClick={openUpdateModal}>
                    Update Task
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="pt-6 space-y-8">
              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Description
                </h3>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {task.description || "No description provided."}
                </div>
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => {
                      const tagText = typeof tag === 'object' && tag !== null 
                        ? (tag as any).name || (tag as any).id || JSON.stringify(tag)
                        : tag;
                      return (
                        <Badge key={index} variant="secondary" className="px-3 py-1 text-sm font-medium">
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
                className="pointer-cursor"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
              </Button>
            </CardContent>

            <Separator />

            <CardFooter className="bg-slate-50 dark:bg-slate-900/30 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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
