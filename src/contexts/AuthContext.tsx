import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { api } from '../api';

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

  // Check authentication status
  const checkAuthStatus = () => {
    try {
      const token = api.getToken();
      
      // Update last token for change detection
      const previousToken = lastTokenRef.current;
      lastTokenRef.current = token;
      
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // First, try to get user from stored user_data (from login response)
      const storedUser = api.getUser();
      if (storedUser) {
        const userData: User = {
          id: storedUser.id || '',
          email: storedUser.email || '',
          name: storedUser.name,
          ...storedUser,
        };
        setUser(userData);
        setIsLoading(false);
        return;
      }

      // Fall back to decoding token if no stored user data
      const decodedUser = decodeToken(token);
      
      if (decodedUser) {
        setUser(decodedUser);
      } else {
        // Invalid token, clear it
        api.removeToken();
        setUser(null);
        lastTokenRef.current = null;
      }
    } catch (error) {
      api.removeToken();
      setUser(null);
      lastTokenRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is authenticated on mount and when token changes
  useEffect(() => {
    // Initial check
    checkAuthStatus();

    // Listen for storage events (when token is set from another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'user_data') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case token is set in same window
    // This handles the case when external app sets token and redirects here
    const intervalId = setInterval(() => {
      const currentToken = api.getToken();
      
      // If token changed (was null/empty, now has value, or vice versa), recheck
      if (currentToken !== lastTokenRef.current) {
        checkAuthStatus();
      }
    }, 500); // Check every 500ms for faster response

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
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

  // Manual auth check (can be called after external token is set)
  const checkAuth = () => {
    checkAuthStatus();
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
