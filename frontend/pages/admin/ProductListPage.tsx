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
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Refresh list after deletion
      } catch (error) {
        console.error("Failed to delete product", error);
        alert("Failed to delete product.");
      }
    }
  };
  
  if (loading) return <div>Loading products...</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link to="/admin/products/new" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
          Add New Product
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price (VND)</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Availability</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
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
                  <p className="text-gray-900 whitespace-no-wrap">{product.availability}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{product.category}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <Link to={`/admin/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
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