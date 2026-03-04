"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrderById = exports.getOrders = exports.createOrder = exports.createOrderSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            quantity: zod_1.z.number().int().min(1),
        })).min(1),
    })
});
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { items } = req.body;
        // Calculate total amount based on products in DB
        let totalAmount = 0;
        const orderItemsData = [];
        for (const item of items) {
            const product = yield prisma.product.findUnique({ where: { id: item.productId } });
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
            yield prisma.product.update({
                where: { id: product.id },
                data: { stock: product.stock - item.quantity },
            });
        }
        const order = yield prisma.order.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order' });
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let orders;
        if (role === 'ADMIN') {
            orders = yield prisma.order.findMany({ include: { items: true, user: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' } });
        }
        else {
            orders = yield prisma.order.findMany({ where: { userId }, include: { items: true }, orderBy: { createdAt: 'desc' } });
        }
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});
exports.getOrders = getOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const order = yield prisma.order.findUnique({
            where: { id: req.params.id },
            include: {
                items: { include: { product: true } },
                user: { select: { name: true, email: true } }
            }
        });
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        if (order.userId !== userId && role !== 'ADMIN') {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching order details' });
    }
});
exports.getOrderById = getOrderById;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided' });
        }
        const order = yield prisma.order.update({
            where: { id: req.params.id },
            data: { orderStatus: status },
        });
        res.status(200).json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});
exports.updateOrderStatus = updateOrderStatus;
