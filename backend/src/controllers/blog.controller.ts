import { Request, Response } from 'express';
import mongoose from 'mongoose';
import BlogPost from '../models/blogPost.model';
import { sanitizeBlogPayload } from '../utils/blogSanitizer';
import {
    validateBlogCreatePayload,
    validateBlogUpdatePayload,
} from '../utils/requestValidators';

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
export const getBlogPosts = async (req: Request, res: Response) => {
    try {
        const posts = await BlogPost.find({}).sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
export const getBlogPostBySlug = async (req: Request, res: Response) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug });
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get blog post by ID (for Admin)
// @route   GET /api/blog/admin/:id
// @access  Private/Admin
export const getBlogPostById = async (req: Request, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid blog post id' });
        }

        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Create a blog post
// @route   POST /api/blog
// @access  Private/Admin
export const createBlogPost = async (req: Request, res: Response) => {
    try {
        const validation = validateBlogCreatePayload(req.body);
        if (!validation.ok) {
            return res.status(400).json({ message: validation.message });
        }

        const sanitizedBody = sanitizeBlogPayload(validation.data);

        // Create a URL-friendly slug from the title
        const slug = sanitizedBody.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const newPostData = { ...sanitizedBody, slug, date: sanitizedBody.date || new Date() };
        
        const post = new BlogPost(newPostData);
        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(400).json({ message: 'Invalid blog post data' });
    }
};

// @desc    Update a blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
export const updateBlogPost = async (req: Request, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid blog post id' });
        }

        const validation = validateBlogUpdatePayload(req.body);
        if (!validation.ok) {
            return res.status(400).json({ message: validation.message });
        }

        const sanitizedBody = sanitizeBlogPayload(validation.data);

        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        
        // If title is updated, update slug as well
        if (sanitizedBody.title && sanitizedBody.title !== post.title) {
            sanitizedBody.slug = sanitizedBody.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }

        Object.assign(post, sanitizedBody);
        
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: 'Invalid blog post data' });
    }
};

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
export const deleteBlogPost = async (req: Request, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid blog post id' });
        }

        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        await post.deleteOne();
        res.json({ message: 'Blog post removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};