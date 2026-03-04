import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";

export default function Cart() {
    const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();

    if (items.length === 0) {
        return (
            <Layout>
                <div className="luxury-container py-32 text-center">
                    <p className="luxury-subheading mb-4">Your Cart</p>
                    <h1 className="font-heading text-4xl mb-6">Your cart is currently empty.</h1>
                    <p className="text-muted-foreground font-body mb-8">
                        Discover our latest collections and find the perfect piece.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 bg-foreground text-primary-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase font-body hover:opacity-90 transition-opacity"
                    >
                        Explore Collection
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="luxury-container py-12 md:py-20">
                <h1 className="font-heading text-4xl mb-10 text-center md:text-left">Shopping Cart</h1>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-8">
                        {items.map((item) => (
                            <div key={item.productId} className="flex gap-6 border-b pb-8">
                                {/* Image */}
                                <Link to={`/`} className="w-24 h-32 md:w-32 md:h-40 bg-secondary/30 shrink-0 block">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-xs text-muted-foreground font-body">No Image</div>
                                    )}
                                </Link>

                                {/* Item Details */}
                                <div className="flex flex-col justify-between flex-1 py-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-heading text-xl mb-1">{item.name}</h3>
                                            <p className="text-muted-foreground font-body text-sm">${item.price.toFixed(2)}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="text-muted-foreground hover:text-destructive transition-colors p-2"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center border">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                className="px-3 py-1 text-muted-foreground hover:bg-secondary transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="px-4 py-1 text-sm font-body min-w-[3rem] text-center border-x">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="px-3 py-1 text-muted-foreground hover:bg-secondary transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="font-body text-lg">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-secondary/20 p-8 h-fit">
                        <h2 className="font-heading text-2xl mb-6">Order Summary</h2>

                        <div className="space-y-4 font-body text-sm text-muted-foreground border-b pb-6 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-foreground">${getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Complimentary</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes</span>
                                <span>Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="flex justify-between font-body text-lg mb-8">
                            <span>Estimated Total</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>

                        <Link to="/checkout" className="w-full bg-foreground text-primary-foreground py-4 text-xs tracking-[0.2em] uppercase font-body hover:bg-primary hover:text-foreground transition-colors flex justify-center items-center">
                            Proceed to Checkout
                        </Link>

                        <div className="mt-6 text-center">
                            <Link to="/shop" className="luxury-link luxury-subheading inline-flex items-center gap-2">
                                <ArrowLeft size={12} /> Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
