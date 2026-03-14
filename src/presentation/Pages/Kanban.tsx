import { useState } from "react";
import {
  Target,
  Plus,
  MoreHorizontal,
  CheckCircle,
  Search,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";
import { Button } from "@/presentation/components/Button";
import { Badge } from "@/presentation/components/ui/badge";
import { Separator } from "@/presentation/components/ui/separator";
import { Input } from "@/presentation/components/ui/input";
import MetaData from "../components/MetaData";
import { DraggableContainer } from '@/presentation/components/DragAndDrop/DraggableContainer';
import { SortableItem } from '@/presentation/components/DragAndDrop/SortableItem';
import { useKanbanTasks } from '@/app/hooks/useKanbanTasks';
import type { Task } from "@/domain/entities/task.entity";
import { TaskCard } from '@/presentation/components/TaskCard';
import { AddCardDialog } from "@/presentation/components/Kanban/AddCardDialog";
import { AddColumnDialog } from "@/presentation/components/Kanban/AddColumnDialog";
import { EditBoardDialog } from "@/presentation/components/Kanban/EditBoardDialog";
import { EditColumnDialog } from "@/presentation/components/Kanban/EditColumnDialog";
import { AddBoardDialog } from "@/presentation/components/Kanban/AddBoardDialog";
import { useKanbanBoardsQuery, useCreateBoardMutation, useDeleteColumnMutation } from "@/app/Queries/kanban.query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/presentation/components/ui/dropdown-menu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';


export default function Kanban() {
  const { data: boards, isLoading: boardsLoading, error: boardsError } = useKanbanBoardsQuery();
  const createBoardMutation = useCreateBoardMutation();
  const [addBoardOpen, setAddBoardOpen] = useState(false);

  
  if (boardsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your boards...</p>
        </div>
      </div>
    );
  }

  // Error loading boards
  if (boardsError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load boards</p>
          <p className="text-muted-foreground mt-2">{boardsError.message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  // No boards yet — prompt user to create one
  if (!boards || boards.length === 0) {
    return (
      <>
        <MetaData title="Kanban" description="Track your Essential Goals in dynamic Kanban Boards" path="/kanban" type="website" />
        <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <Card className="max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardContent className="py-12 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <LayoutGrid className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No boards yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first Kanban board to start organizing tasks.
              </p>
              <Button
                loading={createBoardMutation.isPending}
                className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
                onClick={() => setAddBoardOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Board
              </Button>
            </CardContent>
          </Card>
        </div>
        <AddBoardDialog
          open={addBoardOpen}
          onOpenChange={setAddBoardOpen}
        />
      </>
    );
  }

  // Auto-select the first board
  const boardId = boards[0].id;

  return (
    <>
      <KanbanBoard boardId={boardId} setAddBoardOpen={setAddBoardOpen} />

      {/* Dialog for creating new boards */}
      <AddBoardDialog
        open={addBoardOpen}
        onOpenChange={setAddBoardOpen}
      />
    </>
  );
}


function KanbanBoard({ 
  boardId
}: { 
  boardId: string;
  setAddBoardOpen: (open: boolean) => void;
}) {
  const {
    tasks,
    columns,
    activeTask,
    dropIndicator,
    totalTasks,
    completedTasks,
    completionRate,
    isLoading,
    error,
    boardName,
    boardDescription,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    deleteBoard,
    isDeletingBoard,
  } = useKanbanTasks(boardId);

  // Dialog state
  const [addColumnOpen, setAddColumnOpen] = useState(false);
  const [editBoardOpen, setEditBoardOpen] = useState(false);
  const [editColumnTarget, setEditColumnTarget] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);
  const [addCardTarget, setAddCardTarget] = useState<{
    columnId: string;
    columnName: string;
  } | null>(null);


  const deleteColumnMutation = useDeleteColumnMutation();

  // Setup sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Open the add-card dialog for a specific column
  const openAddCardDialog = (columnId: string, columnName: string) => {
    setAddCardTarget({ columnId, columnName });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Kanban board...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Failed to load Kanban board</p>
          <p className="text-muted-foreground mt-2">{error.message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaData
        title="Kanban"
        description="Track your Essential Goals in dynamic Kanban Boards"
        path="/kanban"
        type="website"
      />
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8 selection:text-white selection:bg-gray-900"
      role="main"
      aria-label="Kanban Board Page"
    >
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className="p-3 bg-gray-200 dark:bg-gray-800 rounded-xl shadow-sm"
                aria-hidden="true"
              >
                <LayoutGrid className="h-7 w-7 text-gray-700 dark:text-gray-300" />
              </div>
              <div className="group relative">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {boardName || 'Kanban Board'}
                  </h1>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Board options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <DropdownMenuItem
                        onClick={() => setEditBoardOpen(true)}
                        className="cursor-pointer"
                      >
                        Edit Board
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400 cursor-pointer"
                        disabled={isDeletingBoard}
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this board? All columns and tasks will be permanently lost.')) {
                            deleteBoard();
                          }
                        }}
                      >
                        {isDeletingBoard ? 'Deleting...' : 'Delete Board'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg">
                  {boardDescription || 'Organize tasks with drag-and-drop columns'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                aria-label="Toggle view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                aria-label="Filter tasks"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              {/* <Button
                className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
                aria-label="Add new column"
                onClick={() => setAddColumnOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button> */}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{totalTasks}</span> total tasks
            </div>
            <Separator orientation="vertical" className="h-4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">{completedTasks}</span> completed
            </div>
            <Separator orientation="vertical" className="h-4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Progress
                value={completionRate}
                className="w-20 h-2 bg-gray-200 dark:bg-gray-700"
                aria-label={`Completion rate: ${completionRate}%`}
              />
              <span className="font-medium">{completionRate}%</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                aria-label="Search tasks"
              />
            </div>
          </div>
        </header>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div
            className="overflow-x-auto pb-4"
            role="region"
            aria-label="Kanban board columns"
          >
            <div className="flex gap-4 min-w-max">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className="w-80 shrink-0"
                  role="list"
                  aria-label={`${column.title} column`}
                >
                  {/* Column Header */}
                  <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-800/50">
                    <CardHeader className="pb-3 pt-4 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${!column.color?.startsWith('#') ? column.color : ''}`}
                            style={column.color?.startsWith('#') ? { backgroundColor: column.color } : undefined}
                            aria-hidden="true"
                          />
                          <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {column.title}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            aria-label={`${tasks[column.id]?.length || 0} tasks`}
                          >
                            {tasks[column.id]?.length || 0}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 dark:text-gray-400"
                              aria-label="More options"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                            <DropdownMenuItem 
                              onClick={() => setEditColumnTarget({ id: column.id, name: column.title, color: column.color })}
                              className="cursor-pointer"
                            >
                              Rename Column
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
                            <DropdownMenuItem 
                              className="text-red-600 dark:text-red-400 cursor-pointer"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this column? All tasks inside will be lost.')) {
                                  deleteColumnMutation.mutate({ boardId, columnId: column.id });
                                }
                              }}
                            >
                              Delete Column
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Tasks Container */}
                  <DraggableContainer
                    items={tasks[column.id] || []}
                    id={column.id}
                    getItemId={(task: Task) => task.id.toString()}
                    renderItem={(task: Task, index: number) => (
                      <>
                        {/* Drop indicator line before task */}
                        {dropIndicator &&
                         dropIndicator.overId === task.id.toString() &&
                         dropIndicator.position === 'before' && (
                          <div className="h-0.5 bg-blue-500 rounded-full my-1 mx-2" />
                        )}

                        <SortableItem id={task.id.toString()}>
                          <TaskCard 
                            task={task}
                          />
                        </SortableItem>

                        {/* Drop indicator line after task */}
                        {dropIndicator &&
                         dropIndicator.overId === task.id.toString() &&
                         dropIndicator.position === 'after' && (
                          <div className="h-0.5 bg-blue-500 rounded-full my-1 mx-2" />
                        )}

                        {/* Drop indicator for column bottom */}
                        {dropIndicator &&
                         dropIndicator.overId === column.id &&
                         dropIndicator.position === 'column' &&
                         index === (tasks[column.id]?.length || 0) - 1 && (
                          <div className="h-0.5 bg-blue-500 rounded-full my-1 mx-2" />
                        )}
                      </>
                    )}
                    className="space-y-3 min-h-50 py-2"
                  />

                  {/* Add Card Button */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700"
                    aria-label="Add card to this column"
                    onClick={() => openAddCardDialog(column.id, column.title)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add card
                  </Button>
                </div>
              ))}

              {/* Add Column Button */}
              <div className="w-80 shrink-0">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 h-14"
                  aria-label="Add new column"
                  onClick={() => setAddColumnOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Column
                </Button>
              </div>
            </div>
          </div>

          {/* Drag Overlay - Shows the card being dragged */}
          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Empty State — only shown when there are no columns at all */}
        {columns.length === 0 && (
          <Card className="mt-8 border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardContent className="py-12 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <Target className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No columns yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Start by creating your first column to organize tasks on your board.
              </p>
              <Button
                className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
                onClick={() => setAddColumnOpen(true)}
              >
                Create Your First Column
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>

    {/* Dialogs */}
    <AddColumnDialog
      open={addColumnOpen}
      onOpenChange={setAddColumnOpen}
      boardId={boardId}
      nextPosition={columns.length}
    />

    <AddCardDialog
      open={!!addCardTarget}
      onOpenChange={(open) => {
        if (!open) setAddCardTarget(null);
      }}
      boardId={boardId}
      columnId={addCardTarget?.columnId ?? ""}
      columnName={addCardTarget?.columnName ?? ""}
    />

    <EditBoardDialog
      open={editBoardOpen}
      onOpenChange={setEditBoardOpen}
      boardId={boardId}
      currentName={boardName}
      currentDescription={boardDescription}
    />

    <EditColumnDialog
      open={!!editColumnTarget}
      onOpenChange={(open) => {
        if (!open) setEditColumnTarget(null);
      }}
      boardId={boardId}
      columnId={editColumnTarget?.id ?? ""}
      currentName={editColumnTarget?.name ?? ""}
      currentColor={editColumnTarget?.color ?? ""}
    />


    </>
  );
}
