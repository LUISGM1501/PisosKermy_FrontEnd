import apiClient from './client';
import { Category, CategoryFormData } from '../types';

export const categoriesApi = {
  /**
   * Obtener todas las categorías (público)
   */
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/categories');
    return response.data;
  },

  /**
   * Obtener todas las categorías (admin)
   */
  getAllAdmin: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/admin/categories');
    return response.data;
  },

  /**
   * Crear categoría
   */
  create: async (data: CategoryFormData): Promise<Category> => {
    const response = await apiClient.post<Category>('/api/admin/categories', data);
    return response.data;
  },

  /**
   * Actualizar categoría
   */
  update: async (id: number, data: CategoryFormData): Promise<Category> => {
    const response = await apiClient.put<Category>(`/api/admin/categories/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar categoría
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/admin/categories/${id}`);
  },
};