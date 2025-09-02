import { Product, BlogPost } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper to get the auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Helper to create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Auth
export const login = async (credentials: { email: string; password: string; }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

// Products
export const getAdminProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const getAdminProductById = async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
};

export const createProduct = async (productData: Partial<Product>) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
};

export const deleteProduct = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete product');
  return response.json();
};

// Blog Posts
export const getAdminBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch(`${API_BASE_URL}/blog`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  return response.json();
};

export const getAdminBlogPostById = async (id: string): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blog/admin/${id}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch blog post');
    return response.json();
};

export const createBlogPost = async (postData: Partial<BlogPost>) => {
    const response = await fetch(`${API_BASE_URL}/blog`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('Failed to create blog post');
    return response.json();
};

export const updateBlogPost = async (id: string, postData: Partial<BlogPost>) => {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('Failed to update blog post');
    return response.json();
};

export const deleteBlogPost = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete blog post');
    return response.json();
};


// Image Upload
export const uploadImage = async (formData: FormData): Promise<{ imageUrl: string }> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: { 'Authorization': token ? `Bearer ${token}` : '' },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload image');
  }
  return response.json();
};