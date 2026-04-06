import express from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/product.controller';
import { protect, requireAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, requireAdmin, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, requireAdmin, updateProduct)
    .delete(protect, requireAdmin, deleteProduct);

export default router;