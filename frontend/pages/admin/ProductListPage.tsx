import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminProducts, deleteProduct } from '../../api/adminService';
import { Product } from '../../types';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Xóa sản phẩm này?')) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Refresh list after deletion
      } catch (error) {
        console.error("Xóa sản phẩm không thành công", error);
        alert("Xóa sản phẩm không thành công.");
      }
    }
  };
  
  const categoryMap: Record<string, string> = {
    "Rings": "Nhẫn",
    "Necklaces": "Vòng cổ",
    "Bracelets": "Vòng tay",
    "Earrings": "Bông tai",
    "Others": "Khác",
    "Pendants": "Mặt dây",
    "Sets": "Bộ trang sức",
    "Watches": "Đồng hồ",
    "Blog": "Blog"
  };

  const availabilityMap: Record<string, string> = {
    "Available": "Còn hàng",
    "Sold Out": "Hết hàng"
  };

  const getLocalizedCategory = (cat: string) => categoryMap[cat] || cat;
  const getLocalizedAvailability = (status: string) => availabilityMap[status] || status;

  if (loading) return <div>Đang tải sản phẩm...</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sản phẩm</h1>
        <Link to="/admin/products/new" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
          Thêm sản phẩm mới
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ảnh</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá (VND)</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tình trạng</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded"/>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{product.name}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{new Intl.NumberFormat('vi-VN').format(product.price)}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{getLocalizedAvailability(product.availability)}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{getLocalizedCategory(product.category)}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <Link to={`/admin/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</Link>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListPage;