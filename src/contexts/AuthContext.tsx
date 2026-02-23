import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { api } from '../api';
import { getProfile } from '../api/auth';

// User interface
export interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: any;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => void; // Manual refresh of auth status
  getRedirectUrl: () => string | null;
  clearRedirectUrl: () => void;
  getRedirectState: () => any;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastTokenRef = useRef<string | null>(null);

  // Decode JWT token
  const decodeToken = (token: string): User | null => {
    try {
      // JWT tokens have 3 parts: header.payload.signature
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        return null;
      }

      // Decode the payload (second part)
      const payload = parts[1];
      
      // Add padding if needed for base64 decoding
      const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
      const decodedPayload = JSON.parse(atob(paddedPayload));

      // Extract user data from token payload
      const user: User = {
        id: decodedPayload.sub || decodedPayload.id || decodedPayload.user_id || '',
        email: decodedPayload.email || '',
        name: decodedPayload.name || decodedPayload.username || undefined,
        ...decodedPayload, // Include any other fields from token
      };

      return user;
    } catch (error) {
      return null;
    }
  };

  // Check authentication via profile API - simple one-time check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call profile API to check if cookie is set and valid
        const profileData = await getProfile();
        
        // Cookie is valid - user is authenticated
        const userData: User = {
          id: profileData.id || '',
          email: profileData.email || '',
          name: profileData.name,
          ...profileData,
        };
        
        // Store user data
        api.setUser(userData);
        setUser(userData);
        lastTokenRef.current = api.getToken() || 'authenticated';
      } catch (error: any) {
        // Profile API failed - cookie is not set or invalid
        // Clear any stored data
        api.removeToken();
        setUser(null);
        lastTokenRef.current = null;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get redirect URL from localStorage
  const getRedirectUrl = (): string | null => {
    return localStorage.getItem('redirect_url');
  };

  // Clear redirect URL
  const clearRedirectUrl = (): void => {
    localStorage.removeItem('redirect_url');
    localStorage.removeItem('redirect_state');
  };

  // Get redirect state from localStorage
  const getRedirectState = (): any => {
    const stateStr = localStorage.getItem('redirect_state');
    if (stateStr) {
      try {
        return JSON.parse(stateStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  // Logout function
  const logout = () => {
    api.removeToken(); // This also removes user_data
    setUser(null);
    lastTokenRef.current = null;
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Manual auth check (can be called after login/signup)
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const profileData = await getProfile();
      const userData: User = {
        id: profileData.id || '',
        email: profileData.email || '',
        name: profileData.name,
        ...profileData,
      };
      api.setUser(userData);
      setUser(userData);
      lastTokenRef.current = api.getToken() || 'authenticated';
    } catch (error: any) {
      api.removeToken();
      setUser(null);
      lastTokenRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    updateUser,
    checkAuth,
    getRedirectUrl,
    clearRedirectUrl,
    getRedirectState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
