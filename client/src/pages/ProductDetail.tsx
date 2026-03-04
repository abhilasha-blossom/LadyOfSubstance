import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { fetchProductBySlug } from "@/services/api";
import type { Product } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ProductDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        if (!slug) return;

        const loadProduct = async () => {
            try {
                const data = await fetchProductBySlug(slug);
                setProduct(data);
            } catch (error) {
                console.error("Error loading product", error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [slug]);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center py-32">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout>
                <div className="luxury-container py-32 text-center">
                    <h1 className="font-heading text-3xl mb-4">Product Not Found</h1>
                    <Link to="/shop" className="luxury-link luxury-subheading inline-flex items-center gap-2">
                        <ArrowLeft size={12} /> Back to Shop
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="luxury-container py-12 md:py-24">
                <div className="mb-8">
                    <Link to="/shop" className="luxury-link luxury-subheading inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={12} /> Back to Shop
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Images */}
                    <div className="bg-secondary/30 aspect-[4/5] flex items-center justify-center relative overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-muted-foreground font-body">No Image Available</div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center">
                        <p className="luxury-subheading mb-3">{product.category}</p>
                        <h1 className="font-heading text-4xl lg:text-5xl mb-4">{product.name}</h1>
                        <p className="text-xl font-body mb-8 text-muted-foreground">${product.price.toFixed(2)}</p>

                        <div className="luxury-divider ml-0 mb-8" />

                        <p className="font-body text-muted-foreground leading-relaxed mb-10">
                            {product.description || "An exquisite piece crafted with the finest attention to detail. Designed for the woman who appreciates true luxury."}
                        </p>

                        <button
                            className="bg-foreground text-primary-foreground py-4 px-8 w-full md:w-auto font-body tracking-[0.2em] uppercase text-xs hover:bg-primary hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={product.stock === 0}
                            onClick={() => addToCart(product, 1)}
                        >
                            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>

                        {product.stock > 0 && product.stock < 5 && (
                            <p className="text-xs text-destructive mt-4 font-body">Only {product.stock} remaining in stock!</p>
                        )}

                        <div className="mt-12 space-y-6 text-sm font-body text-muted-foreground">
                            <div className="flex border-b pb-4">
                                <span className="w-32 font-medium">Material</span>
                                <span>Premium Quality</span>
                            </div>
                            <div className="flex border-b pb-4">
                                <span className="w-32 font-medium">Shipping</span>
                                <span>Complimentary global shipping</span>
                            </div>
                            <div className="flex border-b pb-4">
                                <span className="w-32 font-medium">Returns</span>
                                <span>30-day complimentary returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
