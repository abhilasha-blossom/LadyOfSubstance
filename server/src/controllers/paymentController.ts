import Razorpay from 'razorpay';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { z } from 'zod';

const prisma = new PrismaClient();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

export const createRazorpayOrder = async (req: Request, res: Response) => {
    try {
        const { amount, receipt } = req.body;

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "USD", // Example: changing to INR if preferred for Razorpay
            receipt,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Razorpay order' });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, system_order_id } = req.body;

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update our system order status
            await prisma.order.update({
                where: { id: system_order_id },
                data: {
                    paymentStatus: 'PAID',
                    razorpayId: razorpay_order_id,
                }
            });

            res.status(200).json({ message: 'Payment verified successfully.' });
        } else {
            res.status(400).json({ message: 'Invalid payment signature.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying payment' });
    }
};
