import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminBlogPostById, createBlogPost, updateBlogPost, uploadImage } from '../../api/adminService';
import { BlogPost } from '../../types';
import { FRONTEND_ROUTES } from '../../constants/routes';
import { createChangeHandler } from '../../utils/formState';

type BlogFormData = Omit<BlogPost, '_id' | 'slug' | 'date'> & { date: string };

const BlogEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Partial<BlogFormData>>({
    title: '',
    author: '',
    coverImage: '',
    content: '',
    date: new Date().toISOString().split('T')[0], // Default to today
  });
  const [loading, setLoading] = useState(isEditing);
  const [isUploading, setIsUploading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      if (!id) {
        setFetchError('Missing blog post id in route.');
        setLoading(false);
        return;
      }

      const fetchPost = async () => {
        setFetchError(null);
        try {
          const post = await getAdminBlogPostById(id);
          setFormData({
            title: post.title,
            author: post.author,
            coverImage: post.coverImage,
            content: post.content,
            date: new Date(post.date).toISOString().split('T')[0],
          });
        } catch (error) {
          console.error("Failed to fetch blog post", error);
          setFetchError(error instanceof Error ? error.message : 'Failed to fetch blog post');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditing]);

  const handleChange = createChangeHandler(setFormData);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const uploadData = new FormData();
      uploadData.append('image', file);
      
      try {
        const res = await uploadImage(uploadData);
        setFormData(prev => ({ ...prev, coverImage: res.imageUrl }));
      } catch (error) {
        console.error("Image upload failed", error);
        alert('Image upload failed.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && !id) {
      alert('Cannot update blog post: missing post id in route.');
      return;
    }

    try {
        if (isEditing) {
            await updateBlogPost(id!, formData);
        } else {
            await createBlogPost(formData);
        }
        navigate(FRONTEND_ROUTES.adminBlog);
    } catch (error) {
        console.error("Failed to save blog post", error);
        alert("Failed to save blog post.");
    }
  };
  
  if (loading) return <div>Đang tải bài viết...</div>;
  if (fetchError) {
    return (
      <div className="container mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Không thể tải bài viết: {fetchError}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Blog Post' : 'Add New Post'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Ảnh bìa</label>
          {formData.coverImage && <img src={formData.coverImage} alt="Cover" loading="lazy" decoding="async" className="w-48 h-auto my-2 rounded-md"/>}
          <input type="file" onChange={handleImageUpload} disabled={isUploading} className="text-sm"/>
          {isUploading && <p className="text-sm text-gray-500 mt-1">Đang tải...</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Tác giả</label>
                <input type="text" name="author" value={formData.author} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Nội dung</label>
          <textarea name="content" value={formData.content} onChange={handleChange} rows={15} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        
        <div className="flex justify-end">
            <button type="button" onClick={() => navigate(FRONTEND_ROUTES.adminBlog)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-4">Hủy</button>
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">Lưu bài viết</button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditPage;