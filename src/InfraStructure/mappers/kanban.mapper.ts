import { TaskPriority } from "@/domain/enums/task-priority.enum";
import type { KanbanBoard, KanbanColumn, KanbanCard } from "@/domain/entities/kanban.entity";

export function mapKanbanBoardFromApi(apiData: any): KanbanBoard {
  return {
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    columns: apiData.columns ? apiData.columns.map(mapKanbanColumnFromApi) : [],
    createdAt: new Date(apiData.created_at || apiData.createdAt),
    updatedAt: new Date(apiData.updated_at || apiData.updatedAt),
  };
}

export function mapKanbanColumnFromApi(apiData: any): KanbanColumn {
  return {
    id: apiData.id,
    name: apiData.name,
    color: apiData.color,
    wip_limit: apiData.wip_limit,
    position: apiData.position,
    cards: Array.isArray(apiData.cards)
        ? apiData.cards.map(mapKanbanCardFromApi)
        : [],
  };
}

export function mapKanbanCardFromApi(apiData: any): KanbanCard {
  return {
    id: apiData.id,
    column_id: apiData.column_id,
    title: apiData.title,
    description: apiData.description,
    priority: apiData.priority as TaskPriority,
    labels: apiData.labels || [],
    position: apiData.position,
    completed: apiData.completed || false,
    createdAt: new Date(apiData.created_at || apiData.createdAt),
    updatedAt: new Date(apiData.updated_at || apiData.updatedAt),
  };
}
