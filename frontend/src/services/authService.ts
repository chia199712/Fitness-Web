import type { User, LoginForm } from '../types';
import apiService from './api';

export class AuthService {
  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    const response = await apiService.post<{ user: User; token: string }>('/auth/login', credentials);
    
    if (response.success && response.data.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response.data;
  }


  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      apiService.removeAuthToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiService.post<{ token: string }>('/auth/refresh');
    
    if (response.success && response.data.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!apiService.getAuthToken();
  }

  removeAuthToken(): void {
    apiService.removeAuthToken();
  }
}

export const authService = new AuthService();