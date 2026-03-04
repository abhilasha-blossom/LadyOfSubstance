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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createRazorpayOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});
const createRazorpayOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, receipt } = req.body;
        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "USD", // Example: changing to INR if preferred for Razorpay
            receipt,
        };
        const order = yield razorpay.orders.create(options);
        res.status(200).json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Razorpay order' });
    }
});
exports.createRazorpayOrder = createRazorpayOrder;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, system_order_id } = req.body;
        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
            .update(body.toString())
            .digest("hex");
        const isAuthentic = expectedSignature === razorpay_signature;
        if (isAuthentic) {
            // Update our system order status
            yield prisma.order.update({
                where: { id: system_order_id },
                data: {
                    paymentStatus: 'PAID',
                    razorpayId: razorpay_order_id,
                }
            });
            res.status(200).json({ message: 'Payment verified successfully.' });
        }
        else {
            res.status(400).json({ message: 'Invalid payment signature.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying payment' });
    }
});
exports.verifyPayment = verifyPayment;
