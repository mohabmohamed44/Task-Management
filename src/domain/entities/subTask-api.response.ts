export interface subTaskApiResponse {
    id: number | string;
    task_id: number | string;
    text: string;
    completed: boolean;
    position: number;
    created_at: string;
    updated_at?: string;
}