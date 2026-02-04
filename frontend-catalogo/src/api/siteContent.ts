import apiClient from './client';
import { SiteContent } from '../types';

export const siteContentApi = {
  /**
   * Obtener contenido del sitio por key (público)
   */
  get: async (key: string): Promise<SiteContent> => {
    const response = await apiClient.get<SiteContent>(`/api/site-content/${key}`);
    return response.data;
  },

  /**
   * Actualizar contenido del sitio (admin)
   */
  update: async (key: string, content: string): Promise<SiteContent> => {
    const response = await apiClient.put<SiteContent>(`/api/admin/site-content/${key}`, {
      content,
    });
    return response.data;
  },
};