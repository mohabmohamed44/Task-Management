import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AttachmentUseCases } from '../attachment.usecases';
import { attachmentAPI } from '@/InfraStructure/api/Attachment.api';
import type { CreateAttachmentDto } from '@/domain/entities/attachment.dto';

// Mock attachmentAPI
vi.mock('@/InfraStructure/api/Attachment.api', () => ({
  attachmentAPI: {
    create: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    download: vi.fn(),
  },
}));

describe('AttachmentUseCases', () => {
    let attachmentUseCases: AttachmentUseCases;
    const mockCreate = vi.mocked(attachmentAPI.create);
    const mockGet = vi.mocked(attachmentAPI.get);
    const mockDelete = vi.mocked(attachmentAPI.delete);
    const mockDownload = vi.mocked(attachmentAPI.download);

    beforeEach(() => {
        attachmentUseCases = new AttachmentUseCases();
        vi.clearAllMocks();
    });

    describe('uploadAttachment', () => {
        it('should upload attachment successfully with valid file type', async () => {
            const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
            const dto: CreateAttachmentDto = {
                taskId: 'task-1',
                file: mockFile,
                fileName: 'test.png',
                mimeType: 'image/png',
            };

            const mockResponse = {
                data: {
                    id: 'attachment-1',
                    taskId: 'task-1',
                    fileName: 'test.png',
                    mimeType: 'image/png',
                    url: 'https://example.com/test.png',
                    size: 1024,
                    uploadedAt: new Date(),
                },
                status: 201,
                statusText: 'Created',
                headers: {},
                config: { headers: {} as any },
            };

            mockCreate.mockResolvedValue(mockResponse as any);

            const result = await attachmentUseCases.uploadAttachment(dto);

            expect(mockCreate).toHaveBeenCalledWith(dto.taskId, dto);
            expect(result).toEqual(mockResponse.data);
        });

        it('should upload attachment with jpeg file type', async () => {
            const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
            const dto: CreateAttachmentDto = {
                taskId: 'task-1',
                file: mockFile,
                fileName: 'test.jpg',
                mimeType: 'image/jpeg',
            };

            const mockResponse = {
                data: {
                    id: 'attachment-1',
                    taskId: 'task-1',
                    fileName: 'test.jpg',
                    mimeType: 'image/jpeg',
                    url: 'https://example.com/test.jpg',
                    size: 2048,
                    uploadedAt: new Date(),
                },
                status: 201,
                statusText: 'Created',
                headers: {},
                config: { headers: {} as any },
            };

            mockCreate.mockResolvedValue(mockResponse as any);

            const result = await attachmentUseCases.uploadAttachment(dto);

            expect(mockCreate).toHaveBeenCalledWith(dto.taskId, dto);
            expect(result).toEqual(mockResponse.data);
        });

        it('should upload attachment with pdf file type', async () => {
            const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
            const dto: CreateAttachmentDto = {
                taskId: 'task-1',
                file: mockFile,
                fileName: 'test.pdf',
                mimeType: 'application/pdf',
            };

            const mockResponse = {
                data: {
                    id: 'attachment-1',
                    taskId: 'task-1',
                    fileName: 'test.pdf',
                    mimeType: 'application/pdf',
                    url: 'https://example.com/test.pdf',
                    size: 3072,
                    uploadedAt: new Date(),
                },
                status: 201,
                statusText: 'Created',
                headers: {},
                config: { headers: {} as any },
            };

            mockCreate.mockResolvedValue(mockResponse as any);

            const result = await attachmentUseCases.uploadAttachment(dto);

            expect(mockCreate).toHaveBeenCalledWith(dto.taskId, dto);
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw error for invalid file type', async () => {
            const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
            const dto: CreateAttachmentDto = {
                taskId: 'task-1',
                file: mockFile,
                fileName: 'test.txt',
                mimeType: 'text/plain',
            };

            await expect(attachmentUseCases.uploadAttachment(dto)).rejects.toThrow('Invalid File Type');
            expect(mockCreate).not.toHaveBeenCalled();
        });
    });

    describe('getAttachmentById', () => {
        it('should return attachments for a task', async () => {
            const taskId = 'task-1';
            const mockResponse = {
                data: [
                    {
                        id: 'attachment-1',
                        taskId: 'task-1',
                        fileName: 'test1.png',
                        mimeType: 'image/png',
                        url: 'https://example.com/test1.png',
                        size: 1024,
                        uploadedAt: new Date(),
                    },
                    {
                        id: 'attachment-2',
                        taskId: 'task-1',
                        fileName: 'test2.pdf',
                        mimeType: 'application/pdf',
                        url: 'https://example.com/test2.pdf',
                        size: 2048,
                        uploadedAt: new Date(),
                    },
                ],
                status: 200,
                statusText: 'OK',
                headers: {},
                config: { headers: {} as any },
            };

            mockGet.mockResolvedValue(mockResponse as any);

            const result = await attachmentUseCases.getAttachmentById(taskId);

            expect(mockGet).toHaveBeenCalledWith(taskId);
            expect(result).toEqual(mockResponse.data);
        });

        it('should return empty array when no attachments exist', async () => {
            const taskId = 'task-2';
            const mockResponse = {
                data: [],
                status: 200,
                statusText: 'OK',
                headers: {},
                config: { headers: {} as any },
            };

            mockGet.mockResolvedValue(mockResponse as any);

            const result = await attachmentUseCases.getAttachmentById(taskId);

            expect(mockGet).toHaveBeenCalledWith(taskId);
            expect(result).toEqual([]);
        });
    });

    describe('deleteAttachment', () => {
        it('should delete attachment successfully', async () => {
            const taskId = 'task-1';
            const attachmentId = 'attachment-1';

            const mockResponse = {
                status: 204,
                statusText: 'No Content',
                headers: {},
                config: { headers: {} as any },
            };

            mockDelete.mockResolvedValue(mockResponse as any);

            await expect(attachmentUseCases.deleteAttachment(taskId, attachmentId)).resolves.toBeUndefined();
            expect(mockDelete).toHaveBeenCalledWith(taskId, attachmentId);
        });
    });

    describe('downloadAttachment', () => {
        it('should download attachment and return blob', async () => {
            const taskId = 'task-1';
            const attachmentId = 'attachment-1';
            const mockBlob = new Blob(['test content'], { type: 'image/png' });

            const mockResponse = {
                data: mockBlob,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: { headers: {} as any },
            };

            mockDownload.mockResolvedValue(mockResponse as any);

            const result = await attachmentUseCases.downloadAttachment(taskId, attachmentId);

            expect(mockDownload).toHaveBeenCalledWith(taskId, attachmentId);
            expect(result).toBe(mockBlob);
        });
    });
});
