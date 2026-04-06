export const FRONTEND_ROUTES = {
  home: '/',
  blog: '/blog',
  blogPost: '/blog/:slug',
  product: '/products/:id',
  category: '/:category',
  adminLogin: '/admin/login',
  adminProducts: '/admin/products',
  adminProductsNew: '/admin/products/new',
  adminProductsEdit: '/admin/products/edit/:id',
  adminBlog: '/admin/blog',
  adminBlogNew: '/admin/blog/new',
  adminBlogEdit: '/admin/blog/edit/:id',
} as const;

export const ADMIN_NESTED_ROUTE_PATHS = {
  products: 'products',
  productsNew: 'products/new',
  productsEdit: 'products/edit/:id',
  blog: 'blog',
  blogNew: 'blog/new',
  blogEdit: 'blog/edit/:id',
} as const;