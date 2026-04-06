import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/publicService';
import { Product, ProductAvailability } from '../types';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

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

  const availabilityMap: Record<string, string> = { 
    "Available": "Còn hàng",
    "Sold Out": "Hết hàng"
  };
  const getLocalizedAvailability = (status: string) => availabilityMap[status] || status;

  const moveToIndex = (offset: number) => {
    if (!product?.images?.length) return;
    const currentIndex = product.images.indexOf(activeImage);
    const nextIndex = (currentIndex + offset + product.images.length) % product.images.length;
    setActiveImage(product.images[nextIndex]);
  };

  const handlePrevImage = () => moveToIndex(-1);
  const handleNextImage = () => moveToIndex(1);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      } else if (event.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (event.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen, activeImage, product]);

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
    return <div className="text-center py-24">Không tìm thấy sản phẩm.</div>;
  }

  const availabilityColor = product.availability === ProductAvailability.Available ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-stone-50">
        <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-5 lg:sticky lg:top-24 justify-center lg:justify-start">
            <div className="order-2 lg:order-1 w-full lg:w-20 flex lg:flex-col items-stretch lg:items-center gap-2 lg:h-[640px] lg:overflow-hidden pb-1 lg:pb-0">
              <button
                onClick={() => thumbnailsRef.current?.scrollBy({ top: -80, behavior: 'smooth' })}
                className="hidden lg:flex shrink-0 h-8 w-full items-center justify-center bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow-sm"
                aria-label="Previous image"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div ref={thumbnailsRef} className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden flex-1 min-h-0 scrollbar-hide pb-1 lg:pb-0">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 cursor-pointer border-2 rounded-md overflow-hidden ${activeImage === img ? 'border-black' : 'border-transparent'}`}
                    aria-label={`Product thumbnail ${index + 1}`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${index + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => thumbnailsRef.current?.scrollBy({ top: 80, behavior: 'smooth' })}
                className="hidden lg:flex shrink-0 h-8 w-full items-center justify-center bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow-sm"
                aria-label="Next image"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="order-1 lg:order-2 w-full lg:max-w-[640px] aspect-square lg:h-[640px] cursor-pointer bg-stone-200 mx-auto lg:mx-0 rounded-2xl overflow-hidden" onClick={() => setIsModalOpen(true)}>
              <img src={activeImage} alt={product.name} loading="eager" decoding="async" fetchPriority="high" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:pt-10">
            <p className={`text-sm uppercase font-bold tracking-widest ${availabilityColor} mb-2`}>{getLocalizedAvailability(product.availability)}</p>
            <h1 className="text-3xl md:text-3xl font-serif-display font-semibold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-8">{product.briefDescription}</p>

            <p className="text-3xl font-serif-display text-gray-900 mb-8">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>

            <div className="mt-16 pt-12 border-t border-gray-200">
                <h2 className="text-2xl font-serif-display font-bold text-center mb-8">Mô tả sản phẩm</h2>
                <div className="space-y-8 text-base leading-relaxed">
                    <p className="text-gray-700">{product.description}</p>
                     {Object.keys(product.details).length > 0 && (
                        <div>
                            <h3 className="font-bold text-lg mb-4">Thông tin chi tiết</h3>
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

      {/* Modal for full-size image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsModalOpen(false)}
          style={{
            '--hfqtkC': '3px',
            '--fCuVLy': '2px',
            '--fFEzoc': '1px',
            '--hHSOTV': '0px',
            '--gdTNHt': 'Helvetica Neue,Arial,Hiragino Kaku Gothic ProN Custom,Hiragino Sans Custom,Meiryo Custom,sans-serif',
            '--jpmaOu': 'Helvetica Neue,Arial,PingFang TC Custom,Noto Sans TC Custom,Microsoft JhengHei,Hiragino Kaku Gothic ProN Custom,Hiragino Sans Custom,Meiryo Custom,sans-serif',
            '--kqLvSG': '0px 0px 0px 0px transparent',
            '--ljPKsT': '0px 2px 4px 0px rgba(0,0,0,0.25)',
            '--jPGeEO': 'rgba(0,0,0,0.2)',
          } as React.CSSProperties}
        >
          <div
            className="relative mx-auto w-full max-w-[98vw] max-h-[98vh] md:max-w-[90vw] lg:max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 z-20 h-9 w-9 rounded-lg bg-white/70 p-0.5 text-gray-800 hover:bg-white/90"
              aria-label="Close big image"
            >
              ✕
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 hover:bg-white hidden sm:flex"
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 hover:bg-white hidden sm:flex"
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="relative h-[70vh] md:h-[85vh] rounded-lg bg-transparent shadow-[var(--ljPKsT)]">
              <img
                src={activeImage}
                alt={product.name}
                loading="eager"
                decoding="async"
                className="mx-auto h-full w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProductPage;