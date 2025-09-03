import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    // Render a loading state or null while checking auth
    return null;
  }

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-700">
          <Link to="/admin/products" className="text-2xl font-serif-display font-bold">KLORA Admin</Link>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <NavLink to="/admin/products" className={navLinkClasses}>Sản phẩm</NavLink>
          <NavLink to="/admin/blog" className={navLinkClasses}>Blog</NavLink>
        </nav>
        <div className="px-2 py-4 border-t border-gray-700">
            <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
                Đăng xuất
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
