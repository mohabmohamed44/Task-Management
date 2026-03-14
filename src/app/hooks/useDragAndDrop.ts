import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface UseDragAndDropOptions<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  getItemId: (item: T) => string;
}

export function useDragAndDrop<T>({
  items,
  onReorder,
  getItemId,
}: UseDragAndDropOptions<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
      const newIndex = items.findIndex((item) => getItemId(item) === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
    }

    setActiveId(null);
  }, [items, onReorder, getItemId]);

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragEnd,
    getItemId,
  };
}

// Re-export dnd-kit utilities for components
export {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  DndContext,
  closestCenter,
  CSS,
};