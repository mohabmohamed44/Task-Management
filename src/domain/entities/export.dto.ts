import type { GetTaskQueryDTO } from './get-tasks-query.dto';

export interface ExportRequest {
    format: 'pdf' | 'excel' | 'csv';
    taskIds?: number[];
    filters?: GetTaskQueryDTO; // Change from Taskfilters to GetTaskQueryDTO
    columns?: string[];
}

export interface ExportResponse {
    url: string;
    fileName: string;
    mimeType: string;
}