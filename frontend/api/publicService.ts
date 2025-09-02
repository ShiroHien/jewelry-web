import { Product, BlogPost } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Products
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

// Blog Posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch(`${API_BASE_URL}/blog`);
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  return response.json();
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blog/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch blog post');
    return response.json();
};
