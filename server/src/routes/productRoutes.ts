import { Router } from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, createProductSchema, updateProductSchema } from '../controllers/productController';
import { validate } from '../middleware/validate';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', authenticate, authorizeAdmin, validate(createProductSchema), createProduct);
router.put('/:id', authenticate, authorizeAdmin, validate(updateProductSchema), updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

export default router;
