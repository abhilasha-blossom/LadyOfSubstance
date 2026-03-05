import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function Checkout() {
    const { items, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setLoading(true);

        try {
            // Step 1: Create system order via Backend API
            const token = localStorage.getItem("token") || ""; // We assume dummy token for now if unauthenticated

            const orderRes = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
                    shippingAddress: formData // Note: In future, add shipping address to Prisma schema
                })
            });

            if (!orderRes.ok) throw new Error("Failed to create order");
            const order = await orderRes.json();

            // Step 2: Create Razorpay order
            const rpRes = await fetch("http://localhost:5000/api/payments/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ amount: order.totalAmount, receipt: order.id })
            });

            if (!rpRes.ok) throw new Error("Failed to initialize payment gateway");
            const rpOrder = await rpRes.json();

            // Step 3: Open Razorpay modal
            const options = {
                key: "dummy_key_id", // Replace with env key
                amount: rpOrder.amount,
                currency: rpOrder.currency,
                name: "LadyOfSubstance",
                description: "Luxury Jewelry Purchase",
                order_id: rpOrder.id,
                handler: async function (response: any) {
                    // Step 4: Verify Payment
                    await fetch("http://localhost:5000/api/payments/verify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            system_order_id: order.id,
                        })
                    });

                    clearCart();
                    navigate(`/order-success?orderId=${order.id}`);
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#d4af37" // matches gold primary
                }
            };

            // @ts-ignore
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error(error);
            alert("Order could not be processed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <Layout>
                <div className="luxury-container py-32 text-center">
                    <h1 className="font-heading text-3xl mb-4">Your cart is empty.</h1>
                    <Link to="/shop" className="luxury-link luxury-subheading inline-flex items-center gap-2">
                        <ArrowLeft size={12} /> Return to Shop
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="luxury-container py-12 md:py-20">
                <h1 className="font-heading text-4xl mb-10 text-center md:text-left">Checkout</h1>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Shipping Form */}
                    <div>
                        <h2 className="font-heading text-2xl mb-8 border-b pb-4">Shipping Information</h2>
                        <form onSubmit={handlePlaceOrder} className="space-y-6">

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-muted-foreground">Phone</label>
                                <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-muted-foreground">Address Line 1</label>
                                <input required name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-muted-foreground">Address Line 2 (Optional)</label>
                                <input name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground">City</label>
                                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground">State</label>
                                    <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Postal Code</label>
                                    <input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Country</label>
                                    <input required name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 text-xs tracking-[0.2em] uppercase font-body mt-8 flex justify-center items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-300 font-medium cursor-pointer"
                                style={{ background: 'linear-gradient(135deg, #C6A75E, #E6D3A3)', color: '#FDFDFD' }}
                                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
                                onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1'; }}
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                {loading ? "Processing..." : "Place Order & Pay"}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-secondary/20 p-8 h-fit lg:sticky lg:top-24">
                        <h2 className="font-heading text-2xl mb-6 border-b pb-4">Order Summary</h2>

                        <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                            {items.map(item => (
                                <div key={item.productId} className="flex justify-between items-center font-body text-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-secondary overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full text-[10px] flex items-center justify-center text-muted-foreground">No img</div>
                                                )}
                                            </div>
                                            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: 'linear-gradient(135deg, #C6A75E, #E6D3A3)', color: '#FDFDFD' }}>
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground">{item.name}</span>
                                    </div>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 font-body text-sm text-muted-foreground border-b pb-6 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Complimentary</span>
                            </div>
                        </div>

                        <div className="flex justify-between font-heading text-2xl">
                            <span>Total</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}
