import type { Task } from "@/domain/entities/task.entity";
import type { KanbanColumnDTO } from "@/domain/entities/kanban.entity";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onClick?: () => void;
  columnId?: string;
  columns?: KanbanColumnDTO[];
  onMove?: (task: Task, targetColumnId: string) => void;
}

export function TaskCard({
  task,
  isOverlay = false,
  onClick,
  columnId,
  columns,
  onMove,
}: TaskCardProps) {
  const percent = task.completed ? 100 : 0;

  const columnIndex =
    columns && columnId ? columns.findIndex((c) => c.id === columnId) : -1;
  const prevColumn = columnIndex > 0 ? columns?.[columnIndex - 1] : null;
  const nextColumn =
    columnIndex !== -1 && columnIndex < (columns?.length ?? 0) - 1
      ? columns?.[columnIndex + 1]
      : null;
  const showMoves = !isOverlay && !!onMove && !!columnId;

  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-[#cfc4c5] rounded-lg p-4 space-y-3
        ${isOverlay
          ? 'scale-[1.02] ring-2 ring-black dark:ring-white cursor-grabbing border-black'
          : 'shadow-2xs hover:border-black cursor-pointer transition-all'
        }
        dark:bg-gray-950 dark:border-gray-800 dark:hover:border-gray-100
      `}
      style={{ cursor: isOverlay ? 'grabbing' : 'pointer' }}
      aria-label="Task card"
      aria-required="true"
      aria-invalid={!!task.id}
      aria-describedby="task-card-error"
      aria-pressed={!!task.id}
      id="task-card"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e7576] dark:text-gray-500">
          Due {task.dueDate ? task.dueDate.toLocaleDateString() : "No date"}
        </span>
        {task.priority && (
          <span className="text-[9px] font-bold uppercase bg-[#edeef0] text-[#000000] px-1.5 py-0.5 rounded dark:bg-gray-800 dark:text-gray-100">
            {task.priority}
          </span>
        )}
      </div>

      <h4
        className={`font-bold text-sm text-[#000000] font-montserrat cursor-pointer hover:underline dark:text-gray-100 ${
          task.completed ? "line-through text-gray-400 dark:text-gray-500" : ""
        }`}
      >
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-[#4c4546] dark:text-gray-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-[#4c4546] dark:text-gray-400 font-bold">
          <span>Completion</span>
          <span>{percent}%</span>
        </div>
        <div className="w-full bg-[#e7e8ea] dark:bg-gray-800 h-1 rounded-full overflow-hidden">
          <div
            className="bg-[#000000] dark:bg-gray-100 h-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#cfc4c5] dark:border-gray-800">
        <div className="flex flex-wrap gap-1">
          {task.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold uppercase bg-[#edeef0] text-[#7e7576] dark:bg-gray-800 dark:text-gray-400 px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {showMoves && (
          <div className="flex items-center gap-1">
            {prevColumn && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove?.(task, prevColumn.id);
                }}
                title="Move Previous Phase"
                className="p-1 hover:bg-[#edeef0] rounded border border-[#cfc4c5] text-xs dark:border-gray-700 dark:hover:bg-gray-800"
              >
                ←
              </button>
            )}
            {nextColumn && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove?.(task, nextColumn.id);
                }}
                title="Advance Next Phase"
                className="p-1 hover:bg-[#edeef0] rounded border border-[#cfc4c5] text-xs font-bold dark:border-gray-700 dark:hover:bg-gray-800"
              >
                →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
