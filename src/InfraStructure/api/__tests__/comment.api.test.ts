import { describe, it, expect, vi, beforeEach } from 'vitest';
import { commentsAPI } from '../comments.api';
import type { Comment, CreateCommentRequest, UpdateCommentRequest } from '@/domain/entities/comments.dto';
import type { GetCommentsResponse } from '@/domain/entities/comments.response';

const { apiClientMock } = vi.hoisted(() => {
    const apiClientMock = {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
            request: {
                use: vi.fn(),
            },
            response: {
                use: vi.fn(),
            },
        },
    };
    return { apiClientMock };
});

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => apiClientMock),
    },
}));

describe('commentsAPI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('create', () => {
        it('Should call api.post with correct URL and data, and return the response', async () => {
            const taskId = '123';
            const mockData: CreateCommentRequest = {
                text: 'This is a comment',
            };

            const mockResponse: Comment = {
                id: 1,
                task_id: Number(taskId),
                user_id: 1,
                text: 'This is a comment',
                created_at: new Date(),
                user: {} as Comment['user'],
                userName: 'Test User',
                userEmail: 'test@example.com',
            };

            const fullResponse = {
                data: mockResponse,
                status: 200,
            };

            apiClientMock.post.mockResolvedValueOnce(fullResponse);

            const result = await commentsAPI.create(taskId, mockData);
            expect(apiClientMock.post).toHaveBeenCalledWith(`/tasks/${Number(taskId)}/comments`, { ...mockData, task_id: Number(taskId) });
            expect(result).toEqual(fullResponse);
        });
    });

    describe('get', () => {
        it('Should call api.get with correct URL and return the response', async () => {
            const taskId = '123';
            const mockResponse: GetCommentsResponse = [
                {
                    id: 1,
                    task_id: Number(taskId),
                    user_id: 1,
                    text: 'This is a comment',
                    created_at: new Date(),
                    user: {} as Comment['user'],
                    userName: 'Test User',
                    userEmail: 'test@example.com',
                },
            ];

            const fullResponse = {
                data: mockResponse,
                status: 200,
            };

            apiClientMock.get.mockResolvedValueOnce(fullResponse);

            const result = await commentsAPI.get(taskId);
            expect(apiClientMock.get).toHaveBeenCalledWith(`/tasks/${taskId}/comments`);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('update', () => {
        it('Should call api.put with correct URL and data, and return the response', async () => {
            const taskId = '123';
            const commentId = '1';
            const mockData: UpdateCommentRequest = {
                text: 'Updated comment',
            };

            const mockResponse: Comment = {
                id: Number(commentId),
                task_id: Number(taskId),
                user_id: 1,
                text: 'Updated comment',
                created_at: new Date(),
                user: {} as Comment['user'],
                userName: 'Test User',
                userEmail: 'test@example.com',
            };

            const fullResponse = {
                data: mockResponse,
                status: 200,
            };

            apiClientMock.put.mockResolvedValueOnce(fullResponse);

            const result = await commentsAPI.update(taskId, commentId, mockData);
            expect(apiClientMock.put).toHaveBeenCalledWith(`/tasks/${taskId}/comments/${commentId}`, mockData);
            expect(result).toEqual(fullResponse);
        });
    });

    describe('delete', () => {
        it('Should call api.delete with correct URL and return the response', async () => {
            const taskId = '123';
            const commentId = '1';

            const fullResponse = {
                data: { success: true, message: 'Comment deleted' },
                status: 200,
            };

            apiClientMock.delete.mockResolvedValueOnce(fullResponse);

            const result = await commentsAPI.delete(taskId, commentId);
            expect(apiClientMock.delete).toHaveBeenCalledWith(`/tasks/${taskId}/comments/${commentId}`);
            expect(result).toEqual(fullResponse);
        });
    });
});