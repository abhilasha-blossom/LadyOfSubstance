import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string(),
        price: z.number().positive(),
        category: z.string(),
        images: z.array(z.string()).optional(),
        stock: z.number().int().min(0).optional(),
        bestseller: z.boolean().optional(),
    })
});

export const updateProductSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        category: z.string().optional(),
        images: z.array(z.string()).optional(),
        stock: z.number().int().min(0).optional(),
        bestseller: z.boolean().optional(),
    })
});

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.findUnique({ where: { slug: req.params.slug as string } });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const existingProduct = await prisma.product.findUnique({ where: { slug: req.body.slug } });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this slug already exists.' });
        }

        const newProduct = await prisma.product.create({
            data: req.body,
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: req.params.id as string },
            data: req.body,
        });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await prisma.product.delete({
            where: { id: req.params.id as string },
        });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};
