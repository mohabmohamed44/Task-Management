import { describe, it, expect, vi, beforeEach } from 'vitest';
import { attachmentAPI } from '../Attachment.api';
import type { AttachmentDto, CreateAttachmentDto } from '@/domain/entities/attachment.dto';

// Mock axios
const { apiClientMock } = vi.hoisted(() => {
  const apiClientMock = {
    post: vi.fn(),
    get: vi.fn(),
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

describe('AttachmentAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('Should call api.post with correct URL and data, and return the response', async () => {
      const taskId = '123';
      const mockData: CreateAttachmentDto = {
        file: new File(['file content'], 'test.txt', { type: 'text/plain' }),
        fileName: 'test.txt',
        mimeType: 'text/plain',
        taskId: taskId,
      };
      
      const mockResponse: AttachmentDto = {
        id: '1',
        taskId: taskId,
        fileName: 'test.txt',
        mimeType: 'text/plain',
        size: 1024,
        uploadedAt: new Date(),
        url: 'http://example.com/test.txt',
      };
      
      const fullResponse = {
        data: mockResponse,
        status: 200,
      };
      
      apiClientMock.post.mockResolvedValueOnce(fullResponse);
      
      const response = await attachmentAPI.create(taskId, mockData);
      
      expect(apiClientMock.post).toHaveBeenCalledWith(
        `/tasks/${taskId}/attachments`,
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      // Check content of FormData
      const sentFormData = apiClientMock.post.mock.calls[0][1] as FormData;
      expect(sentFormData.get('file')).toEqual(mockData.file);
      expect(sentFormData.get('fileName')).toBe(mockData.fileName);
      expect(sentFormData.get('mimeType')).toBe(mockData.mimeType);

      expect(response).toEqual(fullResponse);
    });
  });

  describe('get', () => {
    it('Should call api.get with correct URL and return the response', async () => {
      const taskId = '123';
      const mockResponse: AttachmentDto[] = [
        {
          id: '1',
          taskId: taskId,
          fileName: 'test.txt',
          mimeType: 'text/plain',
          size: 1024,
          uploadedAt: new Date(),
          url: 'http://example.com/test.txt',
        },
      ];
      
      const fullResponse = {
        data: mockResponse,
        status: 200,
      };
      
      apiClientMock.get.mockResolvedValueOnce(fullResponse);
      
      const response = await attachmentAPI.get(taskId);
      
      expect(apiClientMock.get).toHaveBeenCalledWith(`/tasks/${taskId}/attachments`);
      expect(response).toEqual(fullResponse);
    });
  });

  describe('delete', () => {
    it('Should call api.delete with correct URL and return the response', async () => {
      const taskId = '123';
      const attachmentId = '1';
      const mockResponse = { message: 'Attachment deleted successfully' };
      
      const fullResponse = {
        data: mockResponse,
        status: 200,
      };
      
      apiClientMock.delete.mockResolvedValueOnce(fullResponse);
      
      const response = await attachmentAPI.delete(taskId, attachmentId);
      
      expect(apiClientMock.delete).toHaveBeenCalledWith(`/tasks/${taskId}/attachments/${attachmentId}`);
      expect(response).toEqual(fullResponse);
    });
  });

  describe('download', () => {
    it('Should call api.get with correct URL and options, and return the response', async () => {
      const taskId = '123';
      const attachmentId = '1';
      const mockBlob = new Blob(['file content'], { type: 'text/plain' });
      
      const fullResponse = {
        data: mockBlob,
        status: 200,
      };
      
      apiClientMock.get.mockResolvedValueOnce(fullResponse);
      
      const response = await attachmentAPI.download(taskId, attachmentId);
      
      expect(apiClientMock.get).toHaveBeenCalledWith(
        `/tasks/${taskId}/attachments/${attachmentId}/download`,
        { responseType: 'blob' }
      );
      expect(response).toEqual(fullResponse);
    });
  });
});
