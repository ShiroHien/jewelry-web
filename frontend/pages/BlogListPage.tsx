import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../api/publicService';
import { BlogPost } from '../types';

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch blog posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-serif-display font-bold">From The Journal</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Inspirations, stories, and deep dives into the world of fine jewelry.</p>
        </div>
        
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index}>
                        <div className="bg-gray-200 animate-pulse w-full aspect-[16/10] mb-6"></div>
                        <div className="h-4 bg-gray-200 animate-pulse w-1/3 mb-4"></div>
                        <div className="h-6 bg-gray-200 animate-pulse w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 animate-pulse w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 animate-pulse w-5/6"></div>
                    </div>
                ))}
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                {posts.map(post => (
                    <Link to={`/blog/${post.slug}`} key={post._id} className="group block">
                        <div className="overflow-hidden mb-6">
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover aspect-[16/10] transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{new Date(post.date).toLocaleDateString()}</p>
                            <h2 className="text-3xl font-serif-display font-bold text-black mb-3 group-hover:text-gray-700 transition-colors">{post.title}</h2>
                            <p className="text-gray-600 mb-4">{post.content.substring(0, 150)}...</p>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
