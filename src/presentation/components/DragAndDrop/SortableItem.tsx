import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    className?: string;
};

export function SortableItem({id, children, className = ''}: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : transition,
    };

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className={`${className} ${isDragging ? 'z-50' : ''}`}
            {...attributes}
            {...listeners}
        >
            {children}
        </div>
    )
}
