import apiClient from './client';
import { Admin } from '../types';

export interface AdminFormData {
  email: string;
  name: string;
  password?: string;
}

interface AdminsListResponse {
  admins: Admin[];
}

interface AdminResponse {
  message: string;
  admin: Admin;
}

export const adminsApi = {
  /**
   * Listar todos los administradores
   */
  getAll: async (): Promise<Admin[]> => {
    const response = await apiClient.get<AdminsListResponse>('/api/auth/admins');
    return response.data.admins;
  },

  /**
   * Crear nuevo administrador
   */
  create: async (data: AdminFormData): Promise<Admin> => {
    const response = await apiClient.post<AdminResponse>('/api/auth/admins', data);
    return response.data.admin;
  },

  /**
   * Actualizar datos de administrador
   */
  update: async (id: number, data: Partial<AdminFormData>): Promise<Admin> => {
    const response = await apiClient.put<AdminResponse>(`/api/auth/admins/${id}`, data);
    return response.data.admin;
  },

  /**
   * Cambiar contraseña de administrador
   */
  changePassword: async (id: number, password: string): Promise<void> => {
    await apiClient.put(`/api/auth/admins/${id}/password`, { password });
  },

  /**
   * Activar/Desactivar administrador
   */
  toggleStatus: async (id: number): Promise<Admin> => {
    const response = await apiClient.put<AdminResponse>(`/api/auth/admins/${id}/toggle`);
    return response.data.admin;
  },
};