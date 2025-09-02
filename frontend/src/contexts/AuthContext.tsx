import React, { createContext, useContext, useCallback, type ReactNode } from 'react';
import type { User, LoginForm, ApiError } from '../types';
import { authService } from '../services';
import { useApp } from './AppContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { state, setUser, setLoading, addNotification, logout: appLogout } = useApp();

  const login = async (credentials: LoginForm): Promise<void> => {
    try {
      setLoading('auth', true);
      const { user } = await authService.login(credentials);
      setUser(user);
      addNotification({
        type: 'success',
        message: `歡迎回來，${user.name}！`
      });
    } catch (error) {
      const apiError = error as ApiError;
      addNotification({
        type: 'error',
        message: apiError.message || '登入失敗'
      });
      throw error;
    } finally {
      setLoading('auth', false);
    }
  };


  const logout = async (): Promise<void> => {
    try {
      setLoading('auth', true);
      await authService.logout();
      appLogout();
      addNotification({
        type: 'info',
        message: '已安全登出'
      });
    } catch {
      // Still logout locally even if server request fails
      appLogout();
      addNotification({
        type: 'warning',
        message: '登出時發生錯誤，但已清除本地資料'
      });
    } finally {
      setLoading('auth', false);
    }
  };

  const getCurrentUser = useCallback(async (): Promise<void> => {
    try {
      setLoading('auth', true);
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch {
      // Token might be invalid, logout
      appLogout();
    } finally {
      setLoading('auth', false);
    }
  }, [setLoading, setUser, appLogout]);

  const refreshToken = async (): Promise<void> => {
    try {
      await authService.refreshToken();
    } catch {
      // If refresh fails, logout
      appLogout();
      addNotification({
        type: 'warning',
        message: '登入已過期，請重新登入'
      });
    }
  };

  // Check if user is authenticated on app start
  React.useEffect(() => {
    if (authService.isAuthenticated() && !state.user) {
      getCurrentUser();
    }
  }, [getCurrentUser, state.user]);

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.loading.auth || false,
    login,
    logout,
    getCurrentUser,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}