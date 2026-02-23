import { api } from './index';

// Login payload interface
export interface LoginPayload {
  email: string;
  password: string;
}

// Signup payload interface
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

// Google login payload interface
export interface GoogleLoginPayload {
  credential: string;
}

// Login response interface
export interface LoginResponse {
  access_token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Login with email and password
 * @param payload - Login credentials
 * @returns Promise with login response containing access token
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('auth/login', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Signup with email and password
 * @param payload - Signup credentials
 * @returns Promise with signup response containing access token
 */
export const signup = async (payload: SignupPayload): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('auth/register', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Login with Google credential
 * @param payload - Google credential
 * @returns Promise with login response containing access token
 */
export const googleLogin = async (payload: GoogleLoginPayload): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('auth/google', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  [key: string]: any;
}

/**
 * Get user profile - verifies authentication via cookies
 * @returns Promise with user profile data
 */
export const getProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>('profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout response interface
export interface LogoutResponse {
  status?: boolean;
  message?: string;
  [key: string]: any;
}

/**
 * Logout user - invalidates session on server
 * @returns Promise with logout response
 */
export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await api.post<LogoutResponse>('auth/logout', {});
    return response.data;
  } catch (error) {
    // Even if logout API fails, we should still clear local state
    throw error;
  }
};