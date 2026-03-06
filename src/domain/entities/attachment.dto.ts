export interface AttachmentDto {
    id: string;
    taskId: string;
    fileName: string;
    mimeType: string;
    url: string;
    size: number;
    uploadedAt:Date;
}

export interface CreateAttachmentDto {
    taskId: string;
    file: File;
    fileName: string;
    mimeType: string;
}

export interface UpdateAttachmentDto {
    id: string;
    taskId: string;
    fileName?: string; // optional renaming for file
    mimeType?: string;
}

export interface IAttachmentUseCases {
    uploadAttachment(dto: CreateAttachmentDto): Promise<AttachmentDto>;
    getAttachmentById (taskId: string): Promise<AttachmentDto[]>;
    deleteAttachment(taskId: string, id: string): Promise<void>;
    downloadAttachment(taskId: string, attachmentId: string): Promise<Blob>;
}
