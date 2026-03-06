import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    useAttachmentsQuery,
    useUploadAttachmentMutation,
    useDeleteAttachmentMutation,
    useDownloadAttachmentMutation,
} from '../attachment.queries';
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

// Helper function to create a wrapper with QueryClient
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('Attachment Queries', () => {
    const mockCreate = vi.mocked(attachmentAPI.create);
    const mockGet = vi.mocked(attachmentAPI.get);
    const mockDelete = vi.mocked(attachmentAPI.delete);
    const mockDownload = vi.mocked(attachmentAPI.download);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useAttachmentsQuery', () => {
        it('should fetch attachments for a task successfully', async () => {
            const taskId = 'task-1';
            const mockAttachments = [
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
            ];

            const mockResponse = {
                data: mockAttachments,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: { headers: {} as any },
            };

            mockGet.mockResolvedValue(mockResponse as any);

            const { result } = renderHook(() => useAttachmentsQuery(taskId), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(true);

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockGet).toHaveBeenCalledWith(taskId);
            expect(result.current.data).toEqual(mockAttachments);
        });

        it('should not fetch when taskId is empty', () => {
            const { result } = renderHook(() => useAttachmentsQuery(''), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toBeUndefined();
            expect(mockGet).not.toHaveBeenCalled();
        });

        it('should handle error when fetching attachments fails', async () => {
            const taskId = 'task-1';
            const error = new Error('Network error');

            mockGet.mockRejectedValue(error);

            const { result } = renderHook(() => useAttachmentsQuery(taskId), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toBe(error);
        });
    });

    describe('useUploadAttachmentMutation', () => {
        it('should upload attachment successfully and invalidate queries', async () => {
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

            const { result } = renderHook(() => useUploadAttachmentMutation(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(dto);

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockCreate).toHaveBeenCalledWith(dto.taskId, dto);
            expect(result.current.data).toEqual(mockResponse.data);
        });

        it('should handle upload error', async () => {
            const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
            const dto: CreateAttachmentDto = {
                taskId: 'task-1',
                file: mockFile,
                fileName: 'test.png',
                mimeType: 'image/png',
            };

            const error = new Error('Upload failed');
            mockCreate.mockRejectedValue(error);

            const { result } = renderHook(() => useUploadAttachmentMutation(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(dto);

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toBe(error);
        });
    });

    describe('useDeleteAttachmentMutation', () => {
        it('should delete attachment successfully and invalidate queries', async () => {
            const taskId = 'task-1';
            const attachmentId = 'attachment-1';

            const mockResponse = {
                status: 204,
                statusText: 'No Content',
                headers: {},
                config: { headers: {} as any },
            };

            mockDelete.mockResolvedValue(mockResponse as any);

            const { result } = renderHook(() => useDeleteAttachmentMutation(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({ taskId, id: attachmentId });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockDelete).toHaveBeenCalledWith(taskId, attachmentId);
        });

        it('should handle delete error', async () => {
            const taskId = 'task-1';
            const attachmentId = 'attachment-1';

            const error = new Error('Delete failed');
            mockDelete.mockRejectedValue(error);

            const { result } = renderHook(() => useDeleteAttachmentMutation(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({ taskId, id: attachmentId });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toBe(error);
        });
    });

    describe('useDownloadAttachmentMutation', () => {
        it('should download attachment successfully', async () => {
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

            const { result } = renderHook(() => useDownloadAttachmentMutation(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({ taskId, attachmentId });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockDownload).toHaveBeenCalledWith(taskId, attachmentId);
            expect(result.current.data).toBe(mockBlob);
        });

        it('should handle download error', async () => {
            const taskId = 'task-1';
            const attachmentId = 'attachment-1';

            const error = new Error('Download failed');
            mockDownload.mockRejectedValue(error);

            const { result } = renderHook(() => useDownloadAttachmentMutation(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({ taskId, attachmentId });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toBe(error);
        });
    });
});
