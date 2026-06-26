import axios, { type AxiosInstance } from "axios";
import { API_URL } from "@/lib/constants";
import { type LoginResponse} from "@/domain/entities/user";
import { type LoginDTO, type RegisterDTO } from "@/domain/entities/auth.dto";
import { type User } from "@/domain/entities/user";


// Create axios instance with proper configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if response is HTML instead of JSON (usually server errors)
        if (error.response?.headers['content-type']?.includes('text/html')) {
            console.error('Received HTML response instead of JSON:', error.response.data);
            // For rate limiting (429), show a clear message
            if (error.response.status === 429) {
                throw new Error('Too many attempts. Please wait a few minutes before trying again.');
            }
            throw new Error('Server error. Please try again later.');
        }
        throw error;
    }
);

export class AuthAPI {
    async login(data: LoginDTO): Promise<LoginResponse> {
        try {
            const res = await apiClient.post('/auth/login', data);
            return res.data;
        } catch (error: unknown) {
            // Re-throw with better error message
            const axiosError = error as any;
            // If it's already an Error with a message, throw it as-is
            if (error instanceof Error) {
                throw error;
            }
            if (axiosError.response?.data?.message) {
                throw new Error(axiosError.response.data.message, { cause: error });
            }
            throw new Error('Network error. Please check your connection.', { cause: error });
        }
    }

    async register(data: RegisterDTO) : Promise<LoginResponse> {
        try {
            const res = await apiClient.post('/auth/register', data);
            return res.data;
        } catch (error: unknown) {
            // Re-throw with better error message
            const axiosError = error as any;
            if (axiosError.response?.data) {
                throw error;
            }
            throw new Error('Network error. Please check your connection.', { cause: error });
        }
    }

    async getCurrentUser (token: string): Promise<User> {
        const res = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        // If backend wraps user in { data: { ...user } }, unwrap it
        return res.data.data || res.data;
    }

    async updateProfilePicture(token: string, file: File): Promise<{ message: string; data: { imageUrl: string } }> {
        const formData = new FormData();
        formData.append('profilePicture', file);

        const res = await axios.put(`${API_URL}/auth/profile-picture`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        return res.data;
    }
}
