import React from 'react';
import { Link } from 'react-router-dom';
import { Product, ProductAvailability } from '../types';

const truncate = (str: string, num: number) => {
  const words = str.split(' ');
  if (words.length > num) {
    return words.slice(0, num).join(' ') + '...';
  }
  return str;
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    console.log("Product Name:", product.name, "Availability:", product.availability);
    const availabilityMap: Record<string, string> = { 
      "Available": "Còn hàng",
      "Sold Out": "Hết hàng"
    };
    const getLocalizedAvailability = (status: string) => availabilityMap[status] || status;
    
    const availabilityColor = product.availability === ProductAvailability.Available ? 'text-green-600' : 'text-red-600';
    
    return (
        <div className="group text-center">
            <div className="relative overflow-hidden mb-4">
                <Link to={`/products/${product._id}`} className="block aspect-square">
                    <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                </Link>
                <Link to={`/products/${product._id}`} className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-6 py-2 border border-black text-black uppercase tracking-widest text-sm">XEM NGAY</span>
                </Link>
            </div>
            <h3 className="text-xl font-serif-display font-bold mb-1">
                <Link to={`/products/${product._id}`} className="hover:text-gray-700 transition-colors">
                    {truncate(product.name, 4)}
                </Link>
            </h3>
            <p className="text-gray-500 text-sm mb-2">{truncate(product.briefDescription, 7)}</p>
            <p className={`text-xs font-bold uppercase tracking-wider ${availabilityColor} mb-2`}>{getLocalizedAvailability(product.availability)}</p>
            <p className="text-base font-medium text-gray-900">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>
        </div>
    );
}

export default ProductCard;