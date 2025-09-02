import express from 'express';
import {
    getBlogPosts,
    getBlogPostBySlug,
    getBlogPostById,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
} from '../controllers/blog.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getBlogPosts)
    .post(protect, createBlogPost);

// Admin-specific route for getting a post by ID (must come before the general slug route)
router.get('/admin/:id', protect, getBlogPostById);

// Public route for viewing a post by slug
router.get('/:slug', getBlogPostBySlug);

router.route('/:id')
    .put(protect, updateBlogPost)
    .delete(protect, deleteBlogPost);

export default router;