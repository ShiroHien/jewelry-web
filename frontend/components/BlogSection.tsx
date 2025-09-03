import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../api/publicService';
import { BlogPost } from '../types';

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <div className="relative overflow-hidden aspect-[4/5]">
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="pt-6 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{new Date(post.date).toLocaleDateString()}</p>
        <h3 className="text-2xl font-serif-display font-bold text-black mb-3 group-hover:text-gray-700 transition-colors">{post.title}</h3>
        <p className="text-gray-600 mb-4">{post.content.substring(0, 120)}...</p>
        <span className="font-bold uppercase tracking-widest text-sm self-start text-black border-b-2 border-black group-hover:border-gray-400 transition-all duration-300">
          Đọc thêm
        </span>
      </div>
    </Link>
  );
};

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data.slice(0, 3)); // Show latest 3
      } catch (error) {
        console.error("Failed to fetch blog posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-serif-display text-center mb-4">Blog</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto text-center">Những câu chuyện và khám phá sâu hơn về thế giới trang sức.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <div className="bg-gray-200 animate-pulse w-full aspect-[4/5] mb-6"></div>
                <div className="h-4 bg-gray-200 animate-pulse w-1/3 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 animate-pulse w-3/4 mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 animate-pulse w-full mx-auto mb-4"></div>
                 <div className="h-4 bg-gray-200 animate-pulse w-1/4 mx-auto"></div>
              </div>
            ))
          ) : (
            posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;