import apiClient from './client';
import { LoginRequest, LoginResponse, Admin } from '../types';

export const authApi = {
  /**
   * Iniciar sesión
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Obtener información del admin actual
   */
  me: async (): Promise<Admin> => {
    const response = await apiClient.get<Admin>('/api/auth/me');
    return response.data;
  },

  /**
   * Obtener bitácora de auditoría
   */
  getAuditLogs: async (page: number = 1) => {
    const response = await apiClient.get('/api/auth/audit', {
      params: { page },
    });
    return response.data;
  },
};

// --- Gestión de Admins ---

export interface AdminFormData {
  email: string;
  name: string;
  password?: string;
}

export interface AdminsListResponse {
  admins: Admin[];
}

export interface AdminResponse {
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