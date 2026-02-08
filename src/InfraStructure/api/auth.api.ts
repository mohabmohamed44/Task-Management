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
    timeout: 10000, // 10 second timeout
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if response is HTML instead of JSON
        if (error.response?.headers['content-type']?.includes('text/html')) {
            console.error('Received HTML response instead of JSON:', error.response.data);
            throw new Error('Server returned an invalid response. Please check if the API is running correctly.');
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
            if (axiosError.response?.data) {
                throw error;
            }
            throw new Error('Network error. Please check your connection.');
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
            throw new Error('Network error. Please check your connection.');
        }
    }

    async getCurrentUser (token: string): Promise<User> {
        const res = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return res.data;
    }
}
