import React, { createContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../api/client';
import { TOKEN_KEY, ADMIN_KEY } from '../utils/constants';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      apiClient.get('/api/auth/me')
        .then(res => setUser({ id: res.data.id, email: res.data.email, name: res.data.name }))
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(ADMIN_KEY);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiClient.post('/api/auth/login', { email, password });
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(ADMIN_KEY, JSON.stringify(res.data.admin));
      setUser(res.data.admin);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.response?.data?.error || 'Error de conexión' };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}