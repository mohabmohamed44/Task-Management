import { useState, useCallback, useMemo } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { useKanbanBoardQuery, useMoveCardMutation, useReorderCardMutation, useDeleteKanboardMutation } from '@/app/Queries/kanban.query';
import type { Task } from '@/domain/entities/task.entity';
import toast from 'react-hot-toast';
import type { DropIndicator, KanbanColumnDTO } from '@/domain/entities/kanban.entity';


export function useKanbanTasks(boardId: string) {
  // localTasks holds optimistic state during drag-drop; null means "use server data"
  const [localTasks, setLocalTasks] = useState<Record<string, Task[]> | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);

  // Fetch board data from backend
  const { data: board, isLoading, error } = useKanbanBoardQuery(boardId);

  // Mutations for drag-drop operations
  const moveCardMutation = useMoveCardMutation();
  const reorderCardMutation = useReorderCardMutation();
  const deleteBoardMutation = useDeleteKanboardMutation();
  // Derive columns from the board data
  const columns: KanbanColumnDTO[] = useMemo(() => {
    if (!board) return [];
    return board.columns.map(col => ({
      id: col.id.toString(),
      title: col.name,
      color: col.color || 'bg-gray-500',
      taskCount: col.cards.length,
    }));
  }, [board]);

  // Transform board data to match existing interface — memoised to avoid infinite re-renders
  const transformedTasks = useMemo<Record<string, Task[]>>(() => {
    if (!board) return {};
    const taskMap: Record<string, Task[]> = {};

    board.columns.forEach(column => {
      taskMap[column.id] = column.cards.map(card => ({
        id: parseInt(card.id),
        title: card.title,
        description: card.description ?? '',
        priority: card.priority,
        category: 'General',
        dueDate: card.createdAt instanceof Date
          ? card.createdAt
          : new Date(card.createdAt),
        tags: card.labels || [],
        completed: card.completed ?? false,
        createdAt: card.createdAt instanceof Date ? card.createdAt : new Date(card.createdAt),
        updatedAt: card.updatedAt instanceof Date ? card.updatedAt : new Date(card.updatedAt),
      }));
    });

    return taskMap;
  }, [board]);

  // Use optimistic local state during drag operations, otherwise use server data
  const tasks = localTasks ?? transformedTasks;

  // Computed stats
  const totalTasks = Object.values(tasks).flat().length;
  const completedTasks = Object.values(tasks).flat().filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Find task by ID across all columns
  const findTaskById = useCallback((id: string): Task | null => {
    for (const columnTasks of Object.values(tasks)) {
      const task = columnTasks.find(t => t.id.toString() === id);
      if (task) return task;
    }
    return null;
  }, [tasks]);

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const taskId = event.active.id as string;
    setActiveTask(findTaskById(taskId));
    setDropIndicator(null);
  }, [findTaskById]);

  // Handle drag over — used to compute the drop indicator position in real time
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      setDropIndicator(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Don't show indicator when hovering over self
    if (activeId === overId) {
      setDropIndicator(null);
      return;
    }

    const isDroppingOnColumn = columns.some(col => col.id === overId);

    if (isDroppingOnColumn) {
      // Hovering directly over a column (empty or end of column)
      setDropIndicator({ overId, position: 'column' });
      return;
    }

    // Hovering over another task — determine above or below using the drag offset
    const overRect = over.rect;
    const activeClientY = active.rect.current.translated?.top ?? 0;
    const overMidY = overRect.top + overRect.height / 2;

    const position: 'before' | 'after' = activeClientY < overMidY ? 'before' : 'after';

    setDropIndicator({ overId, position });
  }, [columns]);

  // Handle drag end - handles both reordering within columns and moving between columns
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setDropIndicator(null);

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which column the active item is in
    let sourceColumn: string | null = null;
    let sourceIndex: number = -1;

    for (const [columnId, columnTasks] of Object.entries(tasks)) {
      const index = columnTasks.findIndex(task => task.id.toString() === activeId);
      if (index !== -1) {
        sourceColumn = columnId;
        sourceIndex = index;
        break;
      }
    }

    if (!sourceColumn || sourceIndex === -1) {
      setActiveTask(null);
      return;
    }

    // Check if dropping on a column (the column itself is the drop target)
    const isDroppingOnColumn = columns.some(col => col.id === overId);

    if (isDroppingOnColumn) {
      // Moving to a new column (at the end)
      const targetColumn = overId;

      if (targetColumn !== sourceColumn) {
        setLocalTasks(prev => {
          const current = prev ?? tasks;
          const sourceTasks = [...current[sourceColumn]];
          const [movedTask] = sourceTasks.splice(sourceIndex, 1);

          return {
            ...current,
            [sourceColumn]: sourceTasks,
            [targetColumn]: [...(current[targetColumn] || []), movedTask],
          };
        });

        // Sync with backend
        moveCardMutation.mutate({
          boardId,
          cardId: activeId,
          data: {
            columnId: parseInt(targetColumn),
            newPosition: tasks[targetColumn]?.length ?? 0,
          },
        }, {
          onSuccess: () => {
            toast.success("Card moved successfully");
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to move card");
            // Revert optimistic update could be added here
          }
        });
      }
    } else {
      // Dropping on another task - find the target column and position
      let targetColumn: string | null = null;
      let targetIndex: number = -1;

      for (const [columnId, columnTasks] of Object.entries(tasks)) {
        const index = columnTasks.findIndex(task => task.id.toString() === overId);
        if (index !== -1) {
          targetColumn = columnId;
          targetIndex = index;
          break;
        }
      }

      if (!targetColumn || targetIndex === -1) {
        setActiveTask(null);
        return;
      }

      if (sourceColumn === targetColumn) {
        // Reordering within the same column
        setLocalTasks(prev => {
          const current = prev ?? tasks;
          return {
            ...current,
            [sourceColumn]: arrayMove(current[sourceColumn], sourceIndex, targetIndex),
          };
        });

        // Sync with backend
        reorderCardMutation.mutate({
          boardId,
          cardId: activeId,
          data: {
            columnId: parseInt(sourceColumn),
            newPosition: targetIndex,
          },
        }, {
          onSuccess: () => {
            toast.success("Card reordered successfully");
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to reorder card");
          }
        });
      } else {
        // Moving to a different column
        setLocalTasks(prev => {
          const current = prev ?? tasks;
          const sourceTasks = [...current[sourceColumn]];
          const targetTasks = [...(current[targetColumn] || [])];
          const [movedTask] = sourceTasks.splice(sourceIndex, 1);

          // Insert at the specific position in target column
          targetTasks.splice(targetIndex, 0, movedTask);

          return {
            ...current,
            [sourceColumn]: sourceTasks,
            [targetColumn]: targetTasks,
          };
        });

        // Sync with backend
        moveCardMutation.mutate({
          boardId,
          cardId: activeId,
          data: {
            columnId: parseInt(targetColumn),
            newPosition: targetIndex,
          },
        }, {
          onSuccess: () => {
            toast.success("Card moved successfully");
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to move card");
          }
        });
      }
    }

    setActiveTask(null);
  }, [tasks, columns, boardId, moveCardMutation, reorderCardMutation]);

  // Move a card between columns via the phase-advance buttons
  const moveTaskToColumn = useCallback((task: Task, targetColumnId: string) => {
    let sourceColumn: string | null = null;
    for (const [columnId, columnTasks] of Object.entries(tasks)) {
      if (columnTasks.some(t => t.id === task.id)) {
        sourceColumn = columnId;
        break;
      }
    }

    if (!sourceColumn || sourceColumn === targetColumnId) return;

    setLocalTasks(prev => {
      const current = prev ?? tasks;
      const sourceTasks = [...current[sourceColumn]];
      const sourceIndex = sourceTasks.findIndex(t => t.id === task.id);
      if (sourceIndex === -1) return current;
      const [movedTask] = sourceTasks.splice(sourceIndex, 1);

      return {
        ...current,
        [sourceColumn]: sourceTasks,
        [targetColumnId]: [...(current[targetColumnId] || []), movedTask],
      };
    });

    moveCardMutation.mutate({
      boardId,
      cardId: task.id.toString(),
      data: {
        columnId: parseInt(targetColumnId),
        newPosition: tasks[targetColumnId]?.length ?? 0,
      },
    }, {
      onSuccess: () => {
        toast.success("Card moved successfully");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to move card");
      },
    });
  }, [tasks, boardId, moveCardMutation]);

  // Delete board function
  const deleteBoard = useCallback(() => {
    deleteBoardMutation.mutate({ boardId });
  }, [boardId, deleteBoardMutation]);

  return {
    tasks,
    columns,
    activeTask,
    dropIndicator,
    totalTasks,
    completedTasks,
    completionRate,
    isLoading,
    error,
    boardName: board?.name ?? '',
    boardDescription: board?.description ?? '',
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    moveTaskToColumn,
    deleteBoard,
    isDeletingBoard: deleteBoardMutation.isPending,
  };
}
