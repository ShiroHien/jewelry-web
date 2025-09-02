import express from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/product.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

export default router;