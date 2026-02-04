/**
 * Formatea un número como precio en colones costarricenses
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Formatea una fecha ISO a formato legible
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Formatea una fecha ISO a formato corto
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

/**
 * Trunca un texto a un número específico de caracteres
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Genera una URL completa para una imagen del backend
 */
export const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return '/placeholder-product.png';
  
  // ===================================================================
  // Detectar si ya es URL completa antes de agregar base
  // ===================================================================
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;  // Ya es URL completa, retornar sin modificar
  }
  
  // Si no es URL completa, agregar base URL
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${imagePath}`;
};