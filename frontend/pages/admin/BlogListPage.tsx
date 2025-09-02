import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminBlogPosts, deleteBlogPost } from '../../api/adminService';
import { BlogPost } from '../../types';

const BlogListPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await getAdminBlogPosts();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch blog posts", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await deleteBlogPost(id);
                fetchPosts(); // Refresh list
            } catch (error) {
                console.error("Failed to delete blog post", error);
                alert("Failed to delete blog post.");
            }
        }
    };

    if (loading) return <div>Loading blog posts...</div>;

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <Link to="/admin/blog/new" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
                    Add New Post
                </Link>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cover Image</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post._id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <img src={post.coverImage} alt={post.title} className="w-24 h-16 object-cover rounded" />
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{post.title}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{post.author}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{new Date(post.date).toLocaleDateString()}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                    <Link to={`/admin/blog/edit/${post._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                    <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlogListPage;