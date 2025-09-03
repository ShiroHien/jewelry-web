import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminProductById, createProduct, updateProduct, uploadImage } from '../../api/adminService';
import { ProductCategory, Product, ProductAvailability } from '../../types';

type ProductFormData = {
  name: string;
  briefDescription: string;
  description: string;
  price: number;
  availability: ProductAvailability;
  images: { url: string, alt: string }[]; // Change from string[] to object[]
  category: ProductCategory;
  tags: string[];
  details: { key: string, value: string }[];
};

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    briefDescription: '',
    description: '',
    price: 0,
    availability: ProductAvailability.Available,
    images: [],
    category: ProductCategory.Others,
    tags: [],
    details: [],
  });
  const [loading, setLoading] = useState(isEditing);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const product = await getAdminProductById(id);
          setFormData({
            name: product.name,
            briefDescription: product.briefDescription,
            description: product.description,
            price: product.price || 0,
            availability: product.availability || ProductAvailability.Available,
            images: product.images.map((img: string) => ({ url: img, alt: product.name })),
            category: product.category,
            tags: product.tags || [],
            details: product.details ? Object.entries(product.details).map(([key, value]) => ({ key, value })) : [],
          });
        } catch (error) {
          console.error("Failed to fetch product", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) : value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }));
  };
  
  const handleDetailChange = (index: number, field: 'key' | 'value', value: string) => {
    const newDetails = [...formData.details];
    newDetails[index][field] = value;
    setFormData(prev => ({ ...prev, details: newDetails }));
  };

  const addDetail = () => {
    setFormData(prev => ({ ...prev, details: [...prev.details, { key: '', value: '' }] }));
  };
  
  const removeDetail = (index: number) => {
     setFormData(prev => ({ ...prev, details: formData.details.filter((_, i) => i !== index) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const file = e.target.files[0];
      const uploadData = new FormData();
      uploadData.append('image', file);

      try {
        const res = await uploadImage(uploadData);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { url: res.imageUrl, alt: prev.name }]
        }));
      } catch (error) {
        console.error("Image upload failed", error);
        alert('Image upload failed.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData: Partial<Product> = {
      ...formData,
      images: formData.images.map(img => img.url), // If backend expects string[]
      price: Number(formData.price) || 0,
      details: formData.details.reduce((acc, detail) => {
          if (detail.key) acc[detail.key] = detail.value;
          return acc;
      }, {} as Record<string, string>)
    };

    try {
        if (isEditing) {
            await updateProduct(id!, productData);
        } else {
            await createProduct(productData);
        }
        navigate('/admin/products');
    } catch (error) {
        console.error("Failed to save product", error);
        alert("Failed to save product.");
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

  // Helper to get localized category name
  const getLocalizedCategory = (cat: string) => categoryMap[cat] || cat;
  const getLocalizedAvailability = (status: string) => availabilityMap[status] || status;

  if (loading) return <div>Đang tải sản phẩm...</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        
        {isEditing && (
            <div>
                <label className="block text-sm font-medium text-gray-500">ID</label>
                <p className="text-sm text-gray-800 bg-gray-100 p-2 rounded-md mt-1">{id}</p>
            </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        
        {/* Images */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Ảnh</label>
            <div className="mt-2 grid grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                        <img src={img.url} alt={img.alt} className="w-full h-32 object-cover rounded-md"/>
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100">&times;</button>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <input type="file" onChange={handleImageUpload} disabled={isUploading || formData.images.length >= 20} className="text-sm"/>
                {isUploading && <p className="text-sm text-gray-500 mt-1">Đang tải...</p>}
            </div>
        </div>
        
        {/* Brief Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
          <textarea name="briefDescription" value={formData.briefDescription} onChange={handleChange} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        
        {/* Full Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả sản phẩm</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>

        {/* Price & Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Giá (VND)</label>
                <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                    required 
                    step="1000"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Tình trạng</label>
                <select name="availability" value={formData.availability} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                    {Object.values(ProductAvailability).map(status => <option key={status} value={status}>{getLocalizedAvailability(status)}</option>)}
                </select>
            </div>
        </div>
        
        {/* Category & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  {Object.values(ProductCategory)
                    .filter(c => c !== 'Blog')
                    .map(cat => (
                      <option key={cat} value={cat}>
                        {getLocalizedCategory(cat)}
                      </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Thẻ (cách nhau bởi dấu phẩy)</label>
                <input type="text" name="tags" value={formData.tags.join(', ')} onChange={handleTagsChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
        </div>
        
        {/* Details */}
        <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Chi tiết</h3>
            <div className="space-y-4">
                {formData.details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <input type="text" placeholder="Key (e.g., Material)" value={detail.key} onChange={e => handleDetailChange(index, 'key', e.target.value)} className="flex-1 border border-gray-300 rounded-md p-2"/>
                        <input type="text" placeholder="Value" value={detail.value} onChange={e => handleDetailChange(index, 'value', e.target.value)} className="flex-1 border border-gray-300 rounded-md p-2"/>
                        <button type="button" onClick={() => removeDetail(index)} className="bg-red-500 text-white px-3 py-1 rounded-md">&times;</button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={addDetail} className="mt-4 text-sm text-indigo-600 hover:text-indigo-800">+ Thêm chi tiết</button>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end">
            <button type="button" onClick={() => navigate('/admin/products')} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-4">Hủy</button>
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">Lưu</button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditPage;