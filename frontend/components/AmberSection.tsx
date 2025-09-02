import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts } from '../api/publicService';
import ProductCard from './ProductCard'; // Import the new reusable component

const AmberSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProducts = await getProducts();
        const amberProducts = allProducts.filter(p => p.tags.includes('amber')).slice(0, 3);
        setProducts(amberProducts);
      } catch (error) {
        console.error("Failed to fetch amber products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-serif-display mb-4">Amber Collection</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">Discover the golden warmth and ancient allure of our exclusive amber pieces.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gray-200 animate-pulse w-full aspect-square mb-4"></div>
                  <div className="h-6 bg-gray-200 animate-pulse w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-full mx-auto"></div>
                </div>
              ))
            ) : (
              products.map(product => (
                  <ProductCard key={product._id} product={product} />
              ))
            )}
        </div>
      </div>
    </section>
  );
};

export default AmberSection;