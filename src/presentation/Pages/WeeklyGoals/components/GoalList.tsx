import { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Target, LayoutGrid, List } from "lucide-react";
import { Button } from "@/presentation/components/Button";
import { GoalItem } from "./GoalItem";
import { GoalItemCompact } from "./GoalItemCompact";

interface GoalListProps {
  goals: any[];
  onToggle: (goalId: string, currentStatus: string) => void;
  onDelete: (goalId: string) => void;
  onView: (goal: any) => void;
  onEdit: (goal: any) => void;
}

export const GoalList = ({ goals, onToggle, onDelete, onView, onEdit }: GoalListProps) => {
  const [viewMode, setViewMode] = useState<"detailed" | "compact">("detailed");
  const parentRef = useRef<HTMLDivElement>(null);

  // Use virtualizer only when list is long (> 20 items)
  // Note: TanStack Virtual has known React Compiler compatibility issues
  const useVirtual = goals.length > 20;

  const virtualizer = useVirtualizer({
    count: goals.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (viewMode === "compact" ? 56 : 100),
    enabled: useVirtual,
  });

  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-500">
        <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No goals found</p>
        <p className="text-sm mt-1">Add a new goal to get started</p>
      </div>
    );
  }

  const GoalComponent = viewMode === "compact" ? GoalItemCompact : GoalItem;

  return (
    <div className="space-y-2">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {goals.length} goal{goals.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "detailed" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("detailed")}
            aria-label="Detailed view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "compact" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("compact")}
            aria-label="Compact view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={parentRef}
        className="h-125 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
      >
        {useVirtual ? (
          // Virtual scrolling for long lists
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
            {virtualizer.getVirtualItems().map((virtualItem: any) => (
              <div
                key={virtualItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="py-1"
              >
                <GoalComponent
                  goal={goals[virtualItem.index]}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onView={onView}
                  onEdit={onEdit}
                />
              </div>
            ))}
          </div>
        ) : (
          // Regular list for short lists
          <div className="space-y-2">
            {goals.map((goal) => (
              <GoalComponent
                key={goal.id}
                goal={goal}
                onToggle={onToggle}
                onDelete={onDelete}
                onView={onView}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
