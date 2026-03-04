import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, createOrderSchema } from '../controllers/orderController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/', authenticate, validate(createOrderSchema), createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, authorizeAdmin, updateOrderStatus);

export default router;
