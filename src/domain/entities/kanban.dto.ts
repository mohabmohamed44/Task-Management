import type { TaskPriority } from "../enums/task-priority.enum";

export interface createKanBanBoardDTO {
    name: string;
    description: string;
};


export interface addColumnToBoardDTO {
    board_id: string | number;
    name: string;
    color: string;
    position: number;
    wip_limit?: number;
}

export interface createCardInBoardDTO {
    column_id: number;
    title: string;
    description: string;
    priority: TaskPriority;
    labels?: string[];
}

export interface moveCardsBetweenColumnsDTO {
    columnId: number;
    newPosition: number;
}

export interface ReorderColumnPositionDTO {
    newPosition: number;
}

export interface ReorderCardWithInColumnDTO {
    columnId: number;
    newPosition: number;
}

export interface updateBoardInfoDTO {
    name?:string;
    description?:string;
}

export interface updateColumnDTO {
    name?:string;
    color?:string;
    wip_limit?:number;
}


export interface updateCardDTO {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  labels?: string[];
}

export interface deleteKanboardDTO {
    boardId:string;
    
}