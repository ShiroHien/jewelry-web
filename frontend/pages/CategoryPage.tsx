import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '../api/publicService';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getProducts();
        const filteredProducts = allProducts.filter(p => p.category.toLowerCase() === category?.toLowerCase());
        setProducts(filteredProducts);
      } catch (error) {
        console.error(`Failed to fetch products for category: ${category}`, error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchAndFilterProducts();
    }
  }, [category]);

  const categoryMap: Record<string, string> = {
    "Rings": "Nhẫn",
    "Necklaces": "Vòng cổ",
    "Bracelets": "Vòng tay",
    "Earrings": "Bông tai",
    "Others": "Khác",
    "Pendants": 'Mặt dây',
    "Sets": 'Bộ trang sức',
    "Watches": 'Đồng hồ',
    "Blog": 'Blog'
  };

  const formattedCategory = category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const localizedCategory = formattedCategory && categoryMap[formattedCategory] ? categoryMap[formattedCategory] : formattedCategory;

  return (
    <div className="container mx-auto px-6 py-32 min-h-[60vh]">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif-display font-bold capitalize mb-4">{localizedCategory}</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <div className="bg-gray-200 animate-pulse w-full aspect-square mb-4"></div>
              <div className="h-6 bg-gray-200 animate-pulse w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 animate-pulse w-full mx-auto"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào trong danh mục này.</p>
      )}
    </div>
  );
};

export default CategoryPage;