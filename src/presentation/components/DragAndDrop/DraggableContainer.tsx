import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';

interface DraggableContainerProps<T> {
  items: T[];
  id: string;
  getItemId: (item: T) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  strategy?: 'vertical' | 'rect';
}

export function DraggableContainer<T>({
  items,
  id,
  getItemId,
  renderItem,
  className = '',
  strategy = 'vertical',
}: DraggableContainerProps<T>) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const sortingStrategy = strategy === 'rect' ? rectSortingStrategy : verticalListSortingStrategy;

  return (
    <SortableContext
      id={id}
      items={items.map(getItemId)}
      strategy={sortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`${className} ${isOver ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600' : ''} transition-all duration-200 min-h-25 rounded-lg`}
      >
        {items.length === 0 && isOver && (
          <div className="flex items-center justify-center h-20 text-blue-600 dark:text-blue-400 text-sm font-medium">
            Drop here
          </div>
        )}
        {items.map((item, index) => (
          <div key={getItemId(item)}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </SortableContext>
  );
}
