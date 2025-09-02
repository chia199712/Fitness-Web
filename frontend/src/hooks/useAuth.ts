import { useState, useEffect } from 'react';
import type { User, LoginForm, ApiError } from '../types';
import { authService } from '../services';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginForm) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      loadCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadCurrentUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to load user data');
      // If token is invalid, clear it
      if (error.status === 401) {
        authService.removeAuthToken();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginForm) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { user: userData } = await authService.login(credentials);
      setUser(userData);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
};