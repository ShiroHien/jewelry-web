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
import BlogEditPage from './pages/admin/BlogEditPage'; // Import the new blog edit page
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';

const App: React.FC = () => {
  return (
    <div className="bg-white min-h-screen text-black relative overflow-x-hidden">
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/new" element={<ProductEditPage />} />
              <Route path="products/edit/:id" element={<ProductEditPage />} />
              <Route path="blog" element={<AdminBlogListPage />} />
              {/* Add routes for blog edit/new */}
              <Route path="blog/new" element={<BlogEditPage />} />
              <Route path="blog/edit/:id" element={<BlogEditPage />} />
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
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/:category" element={<CategoryPage />} />
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