export interface subTask {
    id?: string | number;
    text: string;
    completed?: boolean;
    position?: number;
    task_id?: string | number;
    created_at?: string;
    updated_at?: string;
}

export interface CreateSubTaskDTO {
    text: string;
    position?: number;
}

export interface UpdateSubTaskDTO {
    text?: string;
    completed?: boolean;
    position?: number;
}