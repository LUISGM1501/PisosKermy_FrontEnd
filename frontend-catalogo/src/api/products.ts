import apiClient from './client';
import { AdminProduct, Product, AdminProductsResponse } from '../types';

export const productsApi = {
  /**
   * Obtener todos los productos (público, sin precio)
   */
  getAll: async (params?: {
    page?: number;
    category_id?: number;
    tag_id?: number;
    search?: string;  // NUEVO
  }): Promise<{ products: Product[]; total: number; total_pages: number; pages: number }> => {
    const response = await apiClient.get<{ products: Product[]; total: number; pages: number }>('/api/products', { params });
    return {
      ...response.data,
      total_pages: response.data.pages
    };
  },

  /**
   * Obtener producto por ID (público)
   */
  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/api/products/${id}`);
    return response.data;
  },

  /**
   * Obtener todos los productos (admin, con precio)
   */
  getAllAdmin: async (
    page: number = 1,
    filters?: { category_id?: string; tag_id?: string; provider_id?: string; search?: string }  // NUEVO: search
  ): Promise<AdminProductsResponse> => {
    const params: any = { page };
    if (filters?.category_id) params.category_id = filters.category_id;
    if (filters?.tag_id) params.tag_id = filters.tag_id;
    if (filters?.provider_id) params.provider_id = filters.provider_id;
    if (filters?.search) params.search = filters.search;  // NUEVO

    const response = await apiClient.get<AdminProductsResponse>('/api/admin/products', { params });
    return response.data;
  },

  /**
   * Obtener producto por ID (admin)
   */
  getByIdAdmin: async (id: number): Promise<AdminProduct> => {
    const response = await apiClient.get<AdminProduct>(`/api/admin/products/${id}`);
    return response.data;
  },

  /**
   * Crear producto (con imagen opcional)
   */
  create: async (data: ProductFormData): Promise<AdminProduct> => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }
    formData.append('price', data.price.toString());
    formData.append('category_ids', JSON.stringify(data.category_ids));
    formData.append('tag_ids', JSON.stringify(data.tag_ids));
    formData.append('provider_ids', JSON.stringify(data.provider_ids));
    
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.post<AdminProduct>('/api/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Actualizar producto
   */
  update: async (id: number, data: ProductFormData): Promise<AdminProduct> => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }
    formData.append('price', data.price.toString());
    formData.append('category_ids', JSON.stringify(data.category_ids));
    formData.append('tag_ids', JSON.stringify(data.tag_ids));
    formData.append('provider_ids', JSON.stringify(data.provider_ids));
    
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.put<AdminProduct>(`/api/admin/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Eliminar producto
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/admin/products/${id}`);
  },

  /**
   * Eliminar una imagen específica de un producto
   */
  deleteImage: async (productId: number, imageId: number): Promise<void> => {
    await apiClient.delete(`/api/admin/products/${productId}/images/${imageId}`);
  },

  /**
   * Marcar una imagen como principal
   */
  setPrimaryImage: async (productId: number, imageId: number): Promise<void> => {
    await apiClient.put(`/api/admin/products/${productId}/images/${imageId}/set-primary`);
  },
};

interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  category_ids: number[];
  tag_ids: number[];
  provider_ids: number[];
  image?: File;
}