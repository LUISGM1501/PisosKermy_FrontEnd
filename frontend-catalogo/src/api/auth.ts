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