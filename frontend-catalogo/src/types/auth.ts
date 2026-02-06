// src/types/auth.ts
// Tipos alineados con el backend Flask (auth_routes.py)

export interface Admin {
  id: number;
  email: string;
  name: string;
  is_active?: boolean;  
  created_at?: string; 
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface AuthContextType {
  user: Admin | null;  // Cambiado de 'admin' a 'user' para coincidir con AuthContext.tsx
  token?: string | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}