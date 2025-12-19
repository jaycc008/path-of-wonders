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
  console.log('[AuthContext] AuthProvider rendering');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastTokenRef = useRef<string | null>(null);

  // Log state changes
  useEffect(() => {
    console.log('[AuthContext] State updated:', { 
      hasUser: !!user, 
      userEmail: user?.email, 
      isLoading, 
      isAuthenticated: !!user 
    });
  }, [user, isLoading]);

  // Decode JWT token
  const decodeToken = (token: string): User | null => {
    console.log('[AuthContext] decodeToken called');
    try {
      // JWT tokens have 3 parts: header.payload.signature
      const parts = token.split('.');
      console.log('[AuthContext] Token parts count:', parts.length);
      
      if (parts.length !== 3) {
        console.warn('[AuthContext] Invalid token format - expected 3 parts, got', parts.length);
        return null;
      }

      // Decode the payload (second part)
      const payload = parts[1];
      console.log('[AuthContext] Token payload (first 50 chars):', payload.substring(0, 50) + '...');
      
      // Add padding if needed for base64 decoding
      const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
      const decodedPayload = JSON.parse(atob(paddedPayload));
      console.log('[AuthContext] Decoded token payload:', decodedPayload);

      // Extract user data from token payload
      const user: User = {
        id: decodedPayload.sub || decodedPayload.id || decodedPayload.user_id || '',
        email: decodedPayload.email || '',
        name: decodedPayload.name || decodedPayload.username || undefined,
        ...decodedPayload, // Include any other fields from token
      };

      console.log('[AuthContext] Extracted user data:', { id: user.id, email: user.email, name: user.name });
      return user;
    } catch (error) {
      console.error('[AuthContext] Failed to decode token:', error);
      return null;
    }
  };

  // Check authentication status
  const checkAuthStatus = () => {
    console.log('[AuthContext] checkAuthStatus called');
    try {
      const token = api.getToken();
      console.log('[AuthContext] Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null/empty');
      
      // Update last token for change detection
      const previousToken = lastTokenRef.current;
      lastTokenRef.current = token;
      
      if (token !== previousToken) {
        console.log('[AuthContext] Token changed! Previous:', previousToken ? 'exists' : 'null', 'Current:', token ? 'exists' : 'null');
      }
      
      if (!token) {
        console.log('[AuthContext] No token found - user not authenticated');
        setUser(null);
        setIsLoading(false);
        return;
      }

      // First, try to get user from stored user_data (from login response)
      const storedUser = api.getUser();
      if (storedUser) {
        console.log('[AuthContext] Found stored user data:', storedUser);
        const userData: User = {
          id: storedUser.id || '',
          email: storedUser.email || '',
          name: storedUser.name,
          ...storedUser,
        };
        setUser(userData);
        console.log('[AuthContext] User set from stored data:', userData.email);
        setIsLoading(false);
        return;
      }

      console.log('[AuthContext] No stored user data, attempting to decode token...');
      // Fall back to decoding token if no stored user data
      const decodedUser = decodeToken(token);
      
      if (decodedUser) {
        console.log('[AuthContext] Token decoded successfully, setting user:', decodedUser);
        setUser(decodedUser);
        console.log('[AuthContext] User authenticated:', decodedUser.email);
      } else {
        console.warn('[AuthContext] Token decode failed - clearing token');
        // Invalid token, clear it
        api.removeToken();
        setUser(null);
        lastTokenRef.current = null;
        console.log('[AuthContext] Token cleared, user set to null');
      }
    } catch (error) {
      console.error('[AuthContext] Auth check failed with error:', error);
      api.removeToken();
      setUser(null);
      lastTokenRef.current = null;
      console.log('[AuthContext] Error handled - token cleared, user set to null');
    } finally {
      setIsLoading(false);
      console.log('[AuthContext] Auth check complete. isLoading set to false');
    }
  };

  // Check if user is authenticated on mount and when token changes
  useEffect(() => {
    console.log('[AuthContext] AuthProvider mounted - initializing auth check');
    
    // Initial check
    console.log('[AuthContext] Running initial auth check...');
    checkAuthStatus();

    // Listen for storage events (when token is set from another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      console.log('[AuthContext] Storage event detected:', { key: e.key, newValue: e.newValue ? 'exists' : 'null', oldValue: e.oldValue ? 'exists' : 'null' });
      if (e.key === 'access_token' || e.key === 'user_data') {
        console.log('[AuthContext] access_token or user_data changed in storage - rechecking auth');
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    console.log('[AuthContext] Storage event listener added');

    // Also check periodically in case token is set in same window
    // This handles the case when external app sets token and redirects here
    const intervalId = setInterval(() => {
      const currentToken = api.getToken();
      
      // If token changed (was null/empty, now has value, or vice versa), recheck
      if (currentToken !== lastTokenRef.current) {
        console.log('[AuthContext] Polling detected token change - rechecking auth');
        checkAuthStatus();
      }
    }, 500); // Check every 500ms for faster response

    console.log('[AuthContext] Polling interval started (checking every 500ms)');

    return () => {
      console.log('[AuthContext] Cleaning up - removing listeners and interval');
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
        console.error('Failed to parse redirect state:', error);
        return null;
      }
    }
    return null;
  };

  // Logout function
  const logout = () => {
    console.log('[AuthContext] Logout called - clearing token and user');
    api.removeToken(); // This also removes user_data
    setUser(null);
    lastTokenRef.current = null;
    console.log('[AuthContext] User logged out');
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      console.log('[AuthContext] Updating user data:', userData);
      setUser({ ...user, ...userData });
    }
  };

  // Manual auth check (can be called after external token is set)
  const checkAuth = () => {
    console.log('[AuthContext] Manual auth check triggered');
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
