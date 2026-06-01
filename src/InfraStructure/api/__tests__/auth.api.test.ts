import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { AuthAPI } from '../auth.api';
import type { LoginDTO, RegisterDTO } from '@/domain/entities/auth.dto';
import type { LoginResponse } from '@/domain/entities/user';
import type { User } from '@/domain/entities/user';

// Mock axios
const { apiClientMock } = vi.hoisted(() => {
  const apiClientMock = {
    post: vi.fn(),
    interceptors: {
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
    get: vi.fn(),
    put: vi.fn(),
  },
}));

const mockedAxios = vi.mocked(axios);

describe('AuthAPI', () => {
  let authAPI: AuthAPI;


  beforeEach(() => {
    authAPI = new AuthAPI();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('Should call axios.post with correct URL and data, and return the response data', async () => {
      const mockData: LoginDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse: LoginResponse = {
        success: true,
        token: 'mock-token',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
      };

      const fullResponse = {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      apiClientMock.post.mockResolvedValue(fullResponse);

      const result = await authAPI.login(mockData);

      expect(apiClientMock.post).toHaveBeenCalledWith('/auth/login', mockData);
      expect(result).toEqual(mockResponse);
    });

    it('Should throw error on network failure', async () => {
      const mockData: LoginDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      const networkError = new Error('Network error');

      apiClientMock.post.mockRejectedValue(networkError);

      await expect(authAPI.login(mockData)).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    it('Should call axios.post with correct URL and data, and return the response data', async () => {
      const mockData: RegisterDTO = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      const mockResponse: LoginResponse = {
        success: true,
        token: 'mock-token',
        user: {
          id: 2,
          name: 'New User',
          email: 'new@example.com',
        },
      };

      const fullResponse = {
        data: mockResponse,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: { headers: {} as any },
      };

      apiClientMock.post.mockResolvedValue(fullResponse);

      const result = await authAPI.register(mockData);

      expect(apiClientMock.post).toHaveBeenCalledWith('/auth/register', mockData);
      expect(result).toEqual(mockResponse);
    });

    it('Should throw error on network failure', async () => {
      const mockData: RegisterDTO = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      const networkError = new Error('Network error');

      apiClientMock.post.mockRejectedValue(networkError);

      await expect(authAPI.register(mockData)).rejects.toThrow('Network error. Please check your connection.');
    });
  });

  describe('getCurrentUser', () => {
    it('Should call axios.get with correct URL and authorization header, and return the user data', async () => {
      const token = 'mock-token';

      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        profile_image_url: 'http://example.com/image.jpg',
      };

      const fullResponse = {
        data: mockUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      (mockedAxios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(fullResponse);

      const result = await authAPI.getCurrentUser(token);

      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/auth/me'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('Should unwrap data if wrapped in response', async () => {
      const token = 'mock-token';

      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        profile_image_url: undefined,
      };

      const fullResponse = {
        data: { data: mockUser },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      (mockedAxios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(fullResponse);

      const result = await authAPI.getCurrentUser(token);

      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfilePicture', () => {
    it('Should call axios.put with correct URL, form data, and authorization header, and return the response data', async () => {
      const token = 'mock-token';
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

      const mockResponse = {
        message: 'Profile picture updated successfully',
        data: { imageUrl: 'http://example.com/new-image.jpg' },
      };

      const fullResponse = {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      (mockedAxios.put as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(fullResponse);

      const result = await authAPI.updateProfilePicture(token, mockFile);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/auth/profile-picture'),
        expect.any(FormData),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Check form data content
      const formData = (mockedAxios.put as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1] as FormData;
      expect(formData.get('profilePicture')).toEqual(mockFile);

      expect(result).toEqual(mockResponse);
    });
  });
});