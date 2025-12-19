import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add bearer token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or environment variable
    const token = localStorage.getItem('access_token') || API_TOKEN;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      // You can add redirect logic here if needed
    }
    
    return Promise.reject(error);
  }
);

// API wrapper class
class ApiWrapper {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  // POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  // PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  // PATCH request
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Set bearer token manually
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Set user data
  setUser(user: any): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  // Get user data
  getUser(): any | null {
    const userStr = localStorage.getItem('user_data');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // Remove bearer token
  removeToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  }

  // Get current token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Update base URL
  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }
}

// Export singleton instance
export const api = new ApiWrapper(apiClient);

// Export axios instance for advanced usage
export default apiClient;

