import { api } from "@/InfraStructure/api/http";
import type { AttachmentDto, CreateAttachmentDto } from "@/domain/entities/attachment.dto";

export const attachmentAPI = {
  create: (taskId: string, data: CreateAttachmentDto) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('fileName', data.fileName);
    formData.append('mimeType', data.mimeType);

    return api.post<AttachmentDto>(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  get: (taskId: string) => api.get<AttachmentDto[]>(`/tasks/${taskId}/attachments`),

  delete: (taskId: string, id: string) => api.delete(`/tasks/${taskId}/attachments/${id}`),

  download: (taskId: string, attachmentId: string) => api.get<Blob>(`/tasks/${taskId}/attachments/${attachmentId}/download`, { responseType: 'blob' }),

};