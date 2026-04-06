import express from 'express';
import {
    getBlogPosts,
    getBlogPostBySlug,
    getBlogPostById,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
} from '../controllers/blog.controller';
import { protect, requireAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getBlogPosts)
    .post(protect, requireAdmin, createBlogPost);

// Admin-specific route for getting a post by ID (must come before the general slug route)
router.get('/admin/:id', protect, requireAdmin, getBlogPostById);

// Public route for viewing a post by slug
router.get('/:slug', getBlogPostBySlug);

router.route('/:id')
    .put(protect, requireAdmin, updateBlogPost)
    .delete(protect, requireAdmin, deleteBlogPost);

export default router;