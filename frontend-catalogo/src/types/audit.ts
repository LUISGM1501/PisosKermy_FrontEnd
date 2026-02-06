import apiClient from '../api/client';

export interface AuditEntry {
  id: number;
  admin_id: number;
  admin_email: string | null;
  action: string;
  entity: string | null;
  entity_id: number | null;
  details: any;
  ip_address: string | null;
  created_at: string | null;
}

export interface AuditResponse {
  logs: AuditEntry[];
  total: number;
  pages: number;
  current_page: number;
}

export const auditApi = {
  getLogs: async (page = 1, perPage = 50): Promise<AuditResponse> => {
    const res = await apiClient.get<AuditResponse>('/api/auth/audit', { params: { page, per_page: perPage } });
    return res.data;
  },
};