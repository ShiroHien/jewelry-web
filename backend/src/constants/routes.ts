export const API_BASE_PATH = '/api';

export const API_ROUTES = {
  auth: `${API_BASE_PATH}/auth`,
  products: `${API_BASE_PATH}/products`,
  blog: `${API_BASE_PATH}/blog`,
  upload: `${API_BASE_PATH}/upload`,
} as const;