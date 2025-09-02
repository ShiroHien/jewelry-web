import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogPostBySlug } from '../api/publicService';
import { BlogPost } from '../types';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        setLoading(true);
        try {
          const postData = await getBlogPostBySlug(slug);
          setPost(postData);
        } catch (error) {
          console.error("Failed to fetch blog post", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
        <div className="container mx-auto px-6 py-24 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-12"></div>
            <div className="bg-gray-200 rounded w-full aspect-[16/9] mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        </div>
    );
  }

  if (!post) {
    return <div className="text-center py-24">Blog post not found.</div>;
  }

  return (
    <div className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-4xl">
            <article>
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-serif-display font-bold text-gray-900 mb-4">{post.title}</h1>
                    <div className="text-sm text-gray-500">
                        <span>By {post.author}</span> &bull; <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                </header>
                
                <div className="mb-12">
                    <img src={post.coverImage} alt={post.title} className="w-full h-auto object-cover aspect-[16/9]" />
                </div>
                
                <div 
                    className="prose lg:prose-xl max-w-none mx-auto text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} 
                />
            </article>
        </div>
    </div>
  );
};

export default BlogPostPage;
