"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/create-order', auth_1.authenticate, paymentController_1.createRazorpayOrder);
router.post('/verify', auth_1.authenticate, paymentController_1.verifyPayment);
exports.default = router;
