export interface ApiError {
  error: string;
  details?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface SiteContent {
  key: string;
  content: string;
}

export interface AuditLog {
  id: number;
  admin_id: number;
  admin_username: string;
  action: string;
  entity_type: string;
  entity_id: number | null;
  details: string;
  ip_address: string;
  timestamp: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
