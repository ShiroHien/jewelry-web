import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import ProductListPage from './pages/admin/ProductListPage';
import AdminBlogListPage from './pages/admin/BlogListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import BlogEditPage from './pages/admin/BlogEditPage'; 
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import { ADMIN_NESTED_ROUTE_PATHS, FRONTEND_ROUTES } from './constants/routes';

const App: React.FC = () => {
  return (
    <div className="bg-white min-h-screen text-black relative overflow-x-hidden">
      <Routes>
        <Route path={FRONTEND_ROUTES.adminLogin} element={<AdminLoginPage />} />
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path={ADMIN_NESTED_ROUTE_PATHS.products} element={<ProductListPage />} />
              <Route path={ADMIN_NESTED_ROUTE_PATHS.productsNew} element={<ProductEditPage />} />
              <Route path={ADMIN_NESTED_ROUTE_PATHS.productsEdit} element={<ProductEditPage />} />
              <Route path={ADMIN_NESTED_ROUTE_PATHS.blog} element={<AdminBlogListPage />} />
              <Route path={ADMIN_NESTED_ROUTE_PATHS.blogNew} element={<BlogEditPage />} />
              <Route path={ADMIN_NESTED_ROUTE_PATHS.blogEdit} element={<BlogEditPage />} />
            </Routes>
          </AdminLayout>
        } />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </div>
  );
};

// Main layout for the public-facing site
const MainLayout: React.FC = () => (
  <>
    {/* Dynamic background effect */}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 animate-gradient-xy -z-10"></div>
    
    <Header />
    <main>
      <Routes>
        <Route path={FRONTEND_ROUTES.home} element={<HomePage />} />
        <Route path={FRONTEND_ROUTES.product} element={<ProductPage />} />
        <Route path={FRONTEND_ROUTES.blog} element={<BlogListPage />} />
        <Route path={FRONTEND_ROUTES.blogPost} element={<BlogPostPage />} />
        <Route path={FRONTEND_ROUTES.category} element={<CategoryPage />} />
      </Routes>
    </main>
    <Footer />
    
    <style>{`
      @keyframes gradient-xy {
        0%, 100% {
          background-size: 400% 400%;
          background-position: 0% 50%;
        }
        50% {
          background-size: 200% 200%;
          background-position: 100% 50%;
        }
      }
      .animate-gradient-xy {
        animation: gradient-xy 15s ease infinite;
      }
    `}</style>
  </>
);

export default App;