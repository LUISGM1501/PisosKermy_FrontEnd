import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from './constants';

/**
 * Valida si un archivo es una imagen válida
 */
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'El archivo debe ser una imagen (PNG, JPG, JPEG o WEBP)',
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: 'La imagen no debe superar los 5MB',
    };
  }

  return { valid: true };
};

/**
 * Valida un email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un número de teléfono costarricense
 */
export const validatePhone = (phone: string): boolean => {
  // Acepta formatos: 88888888, 2222-2222, +506 8888-8888, etc.
  const phoneRegex = /^(\+?506)?[-\s]?[2-8]\d{3}[-\s]?\d{4}$/;
  return phoneRegex.test(phone);
};

/**
 * Valida que un string no esté vacío
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Valida que un número sea positivo
 */
export const validatePositiveNumber = (value: number): boolean => {
  return value > 0;
};