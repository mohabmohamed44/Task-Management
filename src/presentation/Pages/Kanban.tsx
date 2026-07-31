import { useState } from "react";
import {
  Target,
  Plus,
  MoreHorizontal,
  CheckCircle,
  Circle,
  Filter,
  List,
  LayoutGrid,
} from "lucide-react";
import { Separator } from "@/presentation/components/ui/separator";
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
import { CardDetailDialog } from "@/presentation/components/Kanban/CardDetailDialog";
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
import type { KanbanBoard as BoardEntity } from "@/domain/entities/kanban.entity";


export default function Kanban() {
  const { data: boards, isLoading: boardsLoading, error: boardsError } = useKanbanBoardsQuery();
  const createBoardMutation = useCreateBoardMutation();
  const [addBoardOpen, setAddBoardOpen] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  
  if (boardsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-white dark:bg-[#0A0A0A] text-black dark:text-white">
        <div className="text-center">
          <div className="animate-spin rounded h-8 w-8 border-2 border-black dark:border-white mx-auto mb-4" />
          <p className="text-[#4B5563] dark:text-white text-sm font-['Inter']">Loading your boards...</p>
        </div>
      </div>
    );
  }

  if (boardsError) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-white dark:bg-[#0A0A0A] text-black dark:text-white">
        <div className="text-center">
          <p className="text-black dark:text-white font-semibold font-['Montserrat']">Failed to load boards</p>
          <p className="text-[#4B5563] dark:text-white mt-2 text-sm font-['Inter']">{boardsError.message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  if (!boards || boards.length === 0) {
    return (
      <>
        <MetaData title="Kanban" description="Track your Essential Goals in dynamic Kanban Boards" path="/kanban" type="website" />
        <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
          <div className="max-w-md w-full border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0A0A0A]">
            <div className="py-12 text-center px-6">
              <div className="inline-flex items-center justify-center p-4 bg-[#F3F4F6] dark:bg-[#0A0A0A] mb-4">
                <LayoutGrid className="h-8 w-8 text-[#4B5563] dark:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2 font-['Montserrat']" style={{ letterSpacing: '-0.01em' }}>
                No boards yet
              </h3>
              <p className="text-[#4B5563] dark:text-gray-300 mb-6 text-sm font-['Inter']">
                Create your first Kanban board to start organizing tasks.
              </p>
              <button
                disabled={createBoardMutation.isPending}
                className="bg-black hover:bg-[#111827] text-white px-4 py-2.5 text-xs uppercase tracking-wider font-bold font-['Montserrat'] inline-flex items-center gap-2 disabled:opacity-50"
                onClick={() => setAddBoardOpen(true)}
              >
                {createBoardMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create Board
              </button>
            </div>
          </div>
        </div>
        <AddBoardDialog
          open={addBoardOpen}
          onOpenChange={setAddBoardOpen}
        />
      </>
    );
  }

  const currentBoardId = selectedBoardId ?? boards[0].id;

  return (
    <>
      {boards.length > 1 && (
        <div className="border-b border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex gap-1 py-3 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent hover:scrollbar-thumb-sky-700 transition-colors" role="tablist" aria-label="Select Kanban Board">
              {boards.map((board: BoardEntity) => (
                <button
                  key={board.id}
                  onClick={() => setSelectedBoardId(board.id)}
                  className={`
                    px-4 py-2 text-xs font-bold uppercase tracking-wider font-['Montserrat'] whitespace-nowrap transition-colors
                    ${currentBoardId === board.id
                      ? 'bg-black dark:bg-white dark:text-black text-white'
                      : 'bg-transparent text-[#4B5563] dark:text-white border border-[#E5E7EB] dark:border-white/10 hover:border-black hover:text-black dark:hover:border-white/20 dark:hover:text-white'
                    }
                  `}
                >
                  {board.name}
                </button>
              ))}
              <button
                onClick={() => setAddBoardOpen(true)}
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider font-['Montserrat'] text-[#4B5563] dark:text-white border border-dashed border-[#E5E7EB] dark:border-white/10 hover:border-black hover:text-black dark:hover:border-white/20 dark:hover:text-white transition-colors whitespace-nowrap"
              >
                <Plus className="h-3 w-3 inline-block mr-1" />
                New Board
              </button>
            </div>
          </div>
        </div>
      )}

      <KanbanBoard boardId={currentBoardId} setAddBoardOpen={setAddBoardOpen} />

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
    moveTaskToColumn,
    deleteBoard,
    isDeletingBoard,
  } = useKanbanTasks(boardId);

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
  const [detailCardTarget, setDetailCardTarget] = useState<Task | null>(null);

  const deleteColumnMutation = useDeleteColumnMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const openAddCardDialog = (columnId: string, columnName: string) => {
    setAddCardTarget({ columnId, columnName });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-white dark:bg-[#0A0A0A] text-black dark:text-white">
        <div className="text-center">
          <div className="animate-spin rounded h-8 w-8 border-2 border-black dark:border-white mx-auto mb-4" />
          <p className="text-[#4B5563] dark:text-white text-sm font-['Inter']">Loading your boards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-white dark:bg-[#0A0A0A] text-black dark:text-white">
        <div className="text-center">
          <div className="text-[#4B5563] dark:text-white mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-black dark:text-white font-semibold font-['Montserrat']">Failed to load Kanban board</p>
          <p className="text-[#4B5563] dark:text-white mt-2 text-sm font-['Inter']">{error.message || 'Please try again later'}</p>
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
        noIndex={false}
      />
    <div
      className="min-h-screen bg-white dark:bg-[#0A0A0A] dark:text-white"
      role="main"
      aria-label="Kanban Board Page"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <header className="py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className="p-2 bg-[#F3F4F6] dark:bg-[#0A0A0A]"
                aria-hidden="true"
              >
                <LayoutGrid className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div className="group relative">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white font-['Montserrat'] leading-[1.2]" style={{ letterSpacing: '-0.01em' }}>
                    {boardName || 'Kanban Board'}
                  </h1>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[#4B5563] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#111111]"
                        aria-label="Board options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-white/10 p-1 min-w-32">
                      <DropdownMenuItem
                        onClick={() => setEditBoardOpen(true)}
                        className="cursor-pointer text-sm px-2 py-1.5 font-['Inter'] text-black dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#111111]"
                      >
                        Edit Board
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#E5E7EB] dark:bg-white/10 my-1" />
                      <DropdownMenuItem
                        className="text-black dark:text-white cursor-pointer text-sm px-2 py-1.5 font-['Inter'] hover:bg-[#F3F4F6] dark:hover:bg-[#111111]"
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
                <p className="text-[#4B5563] dark:text-white mt-1 text-sm font-['Inter']">
                  {boardDescription || 'Organize tasks with drag-and-drop columns'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="h-9 w-9 flex items-center justify-center text-[#4B5563] border border-[#E5E7EB] hover:border-black transition-colors"
                aria-label="Toggle view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                className="h-9 px-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-['Montserrat'] text-[#4B5563] dark:text-white border border-[#E5E7EB] dark:border-white/10 hover:border-black hover:text-black dark:hover:border-white/20 dark:hover:text-white transition-colors"
                aria-label="Filter tasks"
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <button
                className="h-9 px-4 flex items-center gap-2 bg-black hover:bg-[#111827] text-white text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-colors"
                aria-label="Add new column"
                onClick={() => setAddColumnOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Column
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#4B5563] dark:text-white font-['Inter']">
            <span><span className="font-semibold text-black dark:text-white">{totalTasks}</span> total tasks</span>
            <Separator orientation="vertical" className="h-4 bg-[#E5E7EB] dark:bg-white/10" />
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              <span className="font-semibold text-black dark:text-white">{completedTasks}</span> completed
            </span>
            <Separator orientation="vertical" className="h-4 bg-[#E5E7EB] dark:bg-white/10" />
            <span className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-[#E5E7EB] dark:bg-white/10 relative overflow-hidden">
                <div
                  className="h-full bg-black dark:bg-white transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="font-semibold text-black">{completionRate}%</span>
            </span>
          </div>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column, colIndex) => {
              const colTasks = tasks[column.id] || [];
              const isFirst = colIndex === 0;
              const isLast = colIndex === columns.length - 1;
              const ColIcon = isFirst ? List : isLast ? CheckCircle : Circle;

              return (
                <div
                  key={column.id}
                  className="bg-[#f3f4f6] dark:bg-[#0A0A0A] border border-[#cfc4c5] dark:border-white/10 rounded-xl p-4 flex flex-col min-h-[500px]"
                  role="list"
                  aria-label={`${column.title} column`}
                >
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#cfc4c5] dark:border-white/10">
                    <div className="flex items-center gap-2 min-w-0">
                      <ColIcon className="h-4 w-4 text-[#000000] dark:text-white shrink-0" />
                      <h3 className="font-bold font-['Montserrat'] text-sm uppercase text-[#000000] dark:text-white truncate">
                        {column.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="bg-[#000000] dark:bg-white text-white dark:text-black px-2 py-0.5 rounded text-[10px] font-bold">
                        {colTasks.length}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="h-6 w-6 flex items-center justify-center text-[#7e7576] dark:text-white hover:bg-[#edeef0] dark:hover:bg-white/10 rounded"
                            aria-label="More options"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-[#0A0A0A] border border-[#cfc4c5] dark:border-white/10 p-1 min-w-32">
                          <DropdownMenuItem 
                            onClick={() => setEditColumnTarget({ id: column.id, name: column.title, color: column.color })}
                            className="cursor-pointer text-sm px-2 py-1.5 font-['Inter'] text-black dark:text-white hover:bg-[#f3f4f6] dark:hover:bg-[#111111]"
                          >
                            Rename Column
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#cfc4c5] dark:bg-white/10 my-1" />
                          <DropdownMenuItem 
                            className="text-black dark:text-white cursor-pointer text-sm px-2 py-1.5 font-['Inter'] hover:bg-[#f3f4f6] dark:hover:bg-[#111111]"
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
                  </div>

                  <div className="space-y-4 flex-1">
                    {colTasks.length === 0 && (
                      <div className="p-6 text-center border-2 border-dashed border-[#cfc4c5] dark:border-white/10 rounded-lg text-[#7e7576] dark:text-white/50 text-xs">
                        No items in {column.title}
                      </div>
                    )}

                    <DraggableContainer
                      items={colTasks}
                      id={column.id}
                      getItemId={(task: Task) => task.id.toString()}
                      renderItem={(task: Task, index: number) => (
                        <>
                          {dropIndicator &&
                           dropIndicator.overId === task.id.toString() &&
                           dropIndicator.position === 'before' && (
                            <div className="h-0.5 bg-black dark:bg-white my-1" />
                          )}

                          <SortableItem id={task.id.toString()}>
                            <TaskCard 
                              task={task}
                              onClick={() => setDetailCardTarget(task)}
                              columnId={column.id}
                              columns={columns}
                              onMove={moveTaskToColumn}
                            />
                          </SortableItem>

                          {dropIndicator &&
                           dropIndicator.overId === task.id.toString() &&
                           dropIndicator.position === 'after' && (
                            <div className="h-0.5 bg-black dark:bg-white my-1" />
                          )}

                          {dropIndicator &&
                           dropIndicator.overId === column.id &&
                           dropIndicator.position === 'column' &&
                           index === colTasks.length - 1 && (
                            <div className="h-0.5 bg-black dark:bg-white my-1" />
                          )}
                        </>
                      )}
                      className="space-y-4"
                    />
                  </div>

                  <button
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-4 text-xs font-bold uppercase tracking-wider font-['Montserrat'] text-[#4c4546] dark:text-white border border-dashed border-[#cfc4c5] dark:border-white/10 hover:border-black hover:text-black dark:hover:border-white/20 dark:hover:text-white transition-colors bg-white dark:bg-[#0A0A0A] rounded-lg"
                    aria-label="Add card to this column"
                    onClick={() => openAddCardDialog(column.id, column.title)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add card
                  </button>
                </div>
              );
            })}

            <div className="bg-[#f3f4f6] dark:bg-[#0A0A0A] border-2 border-dashed border-[#cfc4c5] dark:border-white/10 rounded-xl p-4 flex flex-col min-h-[500px]">
              <button
                className="flex-1 w-full flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider font-['Montserrat'] text-[#4c4546] dark:text-white border border-dashed border-[#cfc4c5] dark:border-white/10 hover:border-black hover:text-black dark:hover:border-white/20 dark:hover:text-white transition-colors bg-white dark:bg-[#0A0A0A] rounded-lg"
                aria-label="Add new column"
                onClick={() => setAddColumnOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Column
              </button>
            </div>
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>

        {columns.length === 0 && (
          <div className="mt-8 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0A0A0A]">
            <div className="py-12 text-center px-6">
              <div className="inline-flex items-center justify-center p-4 bg-[#F3F4F6] dark:bg-[#0A0A0A] mb-4">
                <Target className="h-8 w-8 text-[#4B5563] dark:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2 font-['Montserrat'] tracking-wider">
                No columns yet
              </h3>
              <p className="text-[#4B5563] dark:text-white max-w-md mx-auto mb-6 text-sm font-['Inter']">
                Start by creating your first column to organize tasks on your board.
              </p>
              <button
                className="bg-black hover:bg-[#111827] text-white px-4 py-2.5 text-xs uppercase tracking-wider font-bold font-['Montserrat'] transition-colors"
                onClick={() => setAddColumnOpen(true)}
              >
                Create Your First Column
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

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

    <CardDetailDialog
      open={!!detailCardTarget}
      onOpenChange={(open) => {
        if (!open) setDetailCardTarget(null);
      }}
      boardId={boardId}
      task={detailCardTarget}
    />


    </>
  );
}
