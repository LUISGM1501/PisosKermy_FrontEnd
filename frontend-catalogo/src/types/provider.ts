export interface Provider {
  id: number;
  name: string;
  contact: string | null;
  phone: string | null;
  description: string | null;
}

export interface ProviderFormData {
  name: string;
  contact?: string;
  phone?: string;
  description?: string;
}
