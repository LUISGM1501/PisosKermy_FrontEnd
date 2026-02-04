// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Pagination
export const PRODUCTS_PER_PAGE = 15;

// Token Storage
export const TOKEN_KEY = 'auth_token';
export const ADMIN_KEY = 'admin_data';

// Image Upload
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Routes
export const ROUTES = {
  // Public
  HOME: '/',
  CATALOG: '/catalogo',
  PRODUCT_DETAIL: '/producto/:id',
  ABOUT: '/nosotros',
  
  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/productos',
  ADMIN_CATEGORIES: '/admin/categorias',
  ADMIN_TAGS: '/admin/etiquetas',
  ADMIN_PROVIDERS: '/admin/proveedores',
  ADMIN_AUDIT: '/admin/bitacora',
  ADMIN_ADMINS: '/admin/admins',
} as const;

// Site Content Keys
export const CONTENT_KEYS = {
  ABOUT_US: 'about_us',
} as const;