import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createOrderSchema = z.object({
    body: z.object({
        items: z.array(z.object({
            productId: z.string(),
            quantity: z.number().int().min(1),
        })).min(1),
    })
});

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { items } = req.body;

        // Calculate total amount based on products in DB
        let totalAmount = 0;
        const orderItemsData: any[] = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                return res.status(404).json({ message: `Product ${item.productId} not found.` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ${product.name}.` });
            }

            totalAmount += (product.price * item.quantity);
            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            });

            // Update stock
            await prisma.product.update({
                where: { id: product.id },
                data: { stock: product.stock - item.quantity },
            });
        }

        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                items: {
                    create: orderItemsData,
                }
            },
            include: {
                items: true,
            }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order' });
    }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const role = req.user!.role;

        let orders;
        if (role === 'ADMIN') {
            orders = await prisma.order.findMany({ include: { items: true, user: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' } });
        } else {
            orders = await prisma.order.findMany({ where: { userId }, include: { items: true }, orderBy: { createdAt: 'desc' } });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const role = req.user!.role;

        const order = await prisma.order.findUnique({
            where: { id: req.params.id as string },
            include: {
                items: { include: { product: true } },
                user: { select: { name: true, email: true } }
            }
        });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.userId !== userId && role !== 'ADMIN') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order details' });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided' });
        }

        const order = await prisma.order.update({
            where: { id: req.params.id as string },
            data: { orderStatus: status },
        });

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};
