import type { WorkoutTemplate, PaginatedResponse } from '../types';
import apiService from './api';

export class TemplateService {
  async getTemplates(page = 1, limit = 10, category?: string): Promise<PaginatedResponse<WorkoutTemplate>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (category) {
      params.append('category', category);
    }
    
    const response = await apiService.get<PaginatedResponse<WorkoutTemplate>>(`/templates?${params}`);
    return response.data;
  }

  async getPublicTemplates(page = 1, limit = 10, category?: string): Promise<PaginatedResponse<WorkoutTemplate>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (category) {
      params.append('category', category);
    }
    
    const response = await apiService.get<PaginatedResponse<WorkoutTemplate>>(`/templates/public?${params}`);
    return response.data;
  }

  async getTemplateById(id: string): Promise<WorkoutTemplate> {
    const response = await apiService.get<WorkoutTemplate>(`/templates/${id}`);
    return response.data;
  }

  async createTemplate(templateData: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<WorkoutTemplate> {
    const response = await apiService.post<WorkoutTemplate>('/templates', templateData);
    return response.data;
  }

  async updateTemplate(id: string, templateData: Partial<WorkoutTemplate>): Promise<WorkoutTemplate> {
    const response = await apiService.put<WorkoutTemplate>(`/templates/${id}`, templateData);
    return response.data;
  }

  async deleteTemplate(id: string): Promise<void> {
    await apiService.delete(`/templates/${id}`);
  }

  async duplicateTemplate(id: string, name?: string): Promise<WorkoutTemplate> {
    const response = await apiService.post<WorkoutTemplate>(`/templates/${id}/duplicate`, { name });
    return response.data;
  }

  async getTemplateCategories(): Promise<string[]> {
    const response = await apiService.get<string[]>('/templates/categories');
    return response.data;
  }

  async searchTemplates(query: string): Promise<WorkoutTemplate[]> {
    const response = await apiService.get<WorkoutTemplate[]>(`/templates/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getPopularTemplates(limit = 10): Promise<WorkoutTemplate[]> {
    const response = await apiService.get<WorkoutTemplate[]>(`/templates/popular?limit=${limit}`);
    return response.data;
  }

  async getFavoriteTemplates(): Promise<WorkoutTemplate[]> {
    const response = await apiService.get<WorkoutTemplate[]>('/templates/favorites');
    return response.data;
  }

  async addToFavorites(id: string): Promise<void> {
    await apiService.post(`/templates/${id}/favorite`);
  }

  async removeFromFavorites(id: string): Promise<void> {
    await apiService.delete(`/templates/${id}/favorite`);
  }
}

export const templateService = new TemplateService();