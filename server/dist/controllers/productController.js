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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProducts = exports.updateProductSchema = exports.createProductSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        slug: zod_1.z.string().min(1),
        description: zod_1.z.string(),
        price: zod_1.z.number().positive(),
        category: zod_1.z.string(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        stock: zod_1.z.number().int().min(0).optional(),
        bestseller: zod_1.z.boolean().optional(),
    })
});
exports.updateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        slug: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive().optional(),
        category: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        stock: zod_1.z.number().int().min(0).optional(),
        bestseller: zod_1.z.boolean().optional(),
    })
});
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});
exports.getProducts = getProducts;
const getProductBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma.product.findUnique({ where: { slug: req.params.slug } });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});
exports.getProductBySlug = getProductBySlug;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingProduct = yield prisma.product.findUnique({ where: { slug: req.body.slug } });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this slug already exists.' });
        }
        const newProduct = yield prisma.product.create({
            data: req.body,
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedProduct = yield prisma.product.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.product.delete({
            where: { id: req.params.id },
        });
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});
exports.deleteProduct = deleteProduct;
