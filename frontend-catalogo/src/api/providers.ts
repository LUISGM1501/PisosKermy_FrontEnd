import apiClient from './client';
import { Provider, ProviderFormData } from '../types';

export const providersApi = {
  /**
   * Obtener todos los proveedores (solo admin)
   */
  getAll: async (): Promise<Provider[]> => {
    const response = await apiClient.get<Provider[]>('/api/admin/providers');
    return response.data;
  },

  /**
   * Crear proveedor
   */
  create: async (data: ProviderFormData): Promise<Provider> => {
    const response = await apiClient.post<Provider>('/api/admin/providers', data);
    return response.data;
  },

  /**
   * Actualizar proveedor
   */
  update: async (id: number, data: ProviderFormData): Promise<Provider> => {
    const response = await apiClient.put<Provider>(`/api/admin/providers/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar proveedor
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/admin/providers/${id}`);
  },
};