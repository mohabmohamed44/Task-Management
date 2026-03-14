import { TaskPriority } from "@/domain/enums/task-priority.enum";

export interface KanbanBoard {
  id: string;
  name: string;
  description: string;
  columns: KanbanColumn[];
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: string;
  name: string;
  color: string;
  position: number;
  wip_limit?: number;
  cards: KanbanCard[];
}

export interface KanbanColumnDTO {
  id: string;
  title: string;
  color: string;
  taskCount: number;
}

export interface KanbanCard {
  id: string;
  column_id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  labels: string[];
  completed: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DropIndicator {
  overId: string;         // The task id OR column id being hovered
  position: 'before' | 'after' | 'column'; // 'column' = empty column / append at bottom
}