import type { AttachmentDto, CreateAttachmentDto, IAttachmentUseCases } from "../entities/attachment.dto";
import { attachmentAPI } from "../../InfraStructure/api/Attachment.api";

export class AttachmentUseCases implements IAttachmentUseCases {
    async uploadAttachment(dto: CreateAttachmentDto): Promise<AttachmentDto> {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
        if (!allowedTypes.includes(dto.mimeType)) {
            throw new Error("Invalid File Type");
        }
        const res = await attachmentAPI.create(dto.taskId, dto);
        return res.data;
    }

    async getAttachmentById(taskId: string): Promise<AttachmentDto[]> {
        const res = await attachmentAPI.get(taskId);
        return res.data;
    }

    async deleteAttachment(taskId: string, id: string): Promise<void> {
        await attachmentAPI.delete(taskId, id);
    }

    async downloadAttachment(taskId: string, attachmentId: string): Promise<Blob> {
        const res = await attachmentAPI.download(taskId, attachmentId);
        return res.data;
    }
}