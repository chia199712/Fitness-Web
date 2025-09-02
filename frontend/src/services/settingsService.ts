import type { UserSettings, User } from '../types';
import apiService from './api';

export class SettingsService {
  async getSettings(): Promise<UserSettings> {
    const response = await apiService.get<UserSettings>('/settings');
    return response.data;
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const response = await apiService.put<UserSettings>('/settings', settings);
    return response.data;
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await apiService.put<User>('/settings/profile', profileData);
    return response.data;
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    await apiService.post('/settings/change-password', data);
  }

  async deleteAccount(): Promise<void> {
    await apiService.delete('/settings/account');
  }

  async exportData(): Promise<Blob> {
    const response = await apiService.get('/settings/export', {
      responseType: 'blob'
    });
    return response.data as Blob;
  }

  async importData(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    
    await apiService.post('/settings/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async getNotificationPreferences(): Promise<UserSettings['notifications']> {
    const response = await apiService.get<UserSettings['notifications']>('/settings/notifications');
    return response.data;
  }

  async updateNotificationPreferences(notifications: UserSettings['notifications']): Promise<UserSettings['notifications']> {
    const response = await apiService.put<UserSettings['notifications']>('/settings/notifications', notifications);
    return response.data;
  }

  async getPrivacySettings(): Promise<UserSettings['privacy']> {
    const response = await apiService.get<UserSettings['privacy']>('/settings/privacy');
    return response.data;
  }

  async updatePrivacySettings(privacy: UserSettings['privacy']): Promise<UserSettings['privacy']> {
    const response = await apiService.put<UserSettings['privacy']>('/settings/privacy', privacy);
    return response.data;
  }
}

export const settingsService = new SettingsService();