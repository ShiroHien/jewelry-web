import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/publicService';
import { Product, ProductAvailability } from '../types';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setLoading(true);
        try {
            const productData = await getProductById(id);
            setProduct(productData);
            if (productData.images && productData.images.length > 0) {
              setActiveImage(productData.images[0]);
            }
        } catch (error) {
            console.error("Failed to fetch product", error);
        } finally {
            setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
            <div className="flex flex-col-reverse md:flex-row gap-4">
                <div className="flex md:flex-col gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded"></div>
                    <div className="w-20 h-20 bg-gray-200 rounded"></div>
                    <div className="w-20 h-20 bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1 bg-gray-200 aspect-square rounded"></div>
            </div>
            <div>
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-24">Product not found.</div>;
  }

  const availabilityColor = product.availability === ProductAvailability.Available ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-stone-50">
        <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-24">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 flex-shrink-0 cursor-pointer border-2 ${activeImage === img ? 'border-black' : 'border-transparent'}`}
                  onMouseEnter={() => setActiveImage(img)}
                >
                  <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-1 aspect-square">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:pt-10">
            <p className={`text-sm uppercase font-bold tracking-widest ${availabilityColor} mb-2`}>{product.availability}</p>
            <h1 className="text-4xl md:text-5xl font-serif-display font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-8">{product.briefDescription}</p>

            <p className="text-3xl font-serif-display text-gray-900 mb-8">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>

            <div className="mt-16 pt-12 border-t border-gray-200">
                <h2 className="text-2xl font-serif-display font-bold text-center mb-8">Description</h2>
                <div className="space-y-8 text-base leading-relaxed">
                    <p className="text-gray-700">{product.description}</p>
                     {Object.keys(product.details).length > 0 && (
                        <div>
                            <h3 className="font-bold text-lg mb-4">Details</h3>
                            <ul className="space-y-2 text-gray-700 border-t border-gray-200 pt-4">
                                {Object.entries(product.details).map(([key, value]) => (
                                    <li key={key} className="flex justify-between">
                                        <strong className="font-medium">{key}</strong>
                                        <span>{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;