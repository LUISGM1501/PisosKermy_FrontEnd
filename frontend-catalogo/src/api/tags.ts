import apiClient from './client';
import { Tag, TagFormData } from '../types';

export const tagsApi = {
  /**
   * Obtener todas las etiquetas (público)
   */
  getAll: async (): Promise<Tag[]> => {
    const response = await apiClient.get<Tag[]>('/api/tags');
    return response.data;
  },

  /**
   * Obtener todas las etiquetas (admin)
   */
  getAllAdmin: async (): Promise<Tag[]> => {
    const response = await apiClient.get<Tag[]>('/api/admin/tags');
    return response.data;
  },

  /**
   * Crear etiqueta
   */
  create: async (data: TagFormData): Promise<Tag> => {
    const response = await apiClient.post<Tag>('/api/admin/tags', data);
    return response.data;
  },

  /**
   * Actualizar etiqueta
   */
  update: async (id: number, data: TagFormData): Promise<Tag> => {
    const response = await apiClient.put<Tag>(`/api/admin/tags/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar etiqueta
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/admin/tags/${id}`);
  },
};