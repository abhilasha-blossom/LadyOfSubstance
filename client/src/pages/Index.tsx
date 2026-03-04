import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/services/api";
import type { Product } from "@/services/api";
import { categories } from "@/data/products";
import { ArrowRight, Loader2 } from "lucide-react";

const Index = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products:", error);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);

    return (
        <Layout>
            {/* Hero */}
            <section className="relative h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/hero.jpg')" }}
                />
                <div className="absolute inset-0 bg-foreground/30" />
                <div className="relative z-10 text-center px-4">
                    <p className="luxury-subheading text-primary-foreground/80 mb-4 fade-in-up">LadyOfSubstance</p>
                    <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-primary-foreground font-medium leading-tight mb-6 fade-in-up fade-in-up-delay-1">
                        Jewelry for women<br />of substance.
                    </h1>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 bg-primary-foreground text-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase font-body hover:opacity-90 transition-opacity fade-in-up fade-in-up-delay-2"
                    >
                        Explore Collection <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            {/* Categories */}
            <section className="luxury-container py-20 md:py-28">
                <div className="text-center mb-14">
                    <p className="luxury-subheading mb-3">Curated For You</p>
                    <h2 className="font-heading text-3xl md:text-4xl">Shop by Category</h2>
                    <div className="luxury-divider mt-4" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            to="/shop"
                            className="group relative bg-secondary aspect-square flex items-end p-4 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <span className="font-heading text-sm md:text-base group-hover:text-primary transition-colors">{cat}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Bestsellers */}
            <section className="bg-secondary/50 py-20 md:py-28">
                <div className="luxury-container">
                    <div className="text-center mb-14">
                        <p className="luxury-subheading mb-3">Most Loved</p>
                        <h2 className="font-heading text-3xl md:text-4xl">Bestsellers</h2>
                        <div className="luxury-divider mt-4" />
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    ) : bestsellers.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                            {bestsellers.map((product) => (
                                <ProductCard key={product.id} product={{
                                    id: product.id,
                                    name: product.name,
                                    slug: product.slug,
                                    price: product.price,
                                    image: product.images?.[0] || undefined
                                }} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground font-body">
                            No products available right now.
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/shop" className="luxury-link luxury-subheading inline-flex items-center gap-2">
                            View All <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Brand Story */}
            <section className="luxury-container py-20 md:py-28">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="aspect-[3/4] overflow-hidden">
                        <img src="/images/about.jpg" alt="LadyOfSubstance brand story" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="max-w-md">
                        <p className="luxury-subheading mb-3">Our Story</p>
                        <h2 className="font-heading text-3xl md:text-4xl mb-6">Crafted for the woman who knows her worth.</h2>
                        <p className="text-muted-foreground font-body leading-relaxed mb-6">
                            LadyOfSubstance was born from the belief that jewelry should be more than decoration — it should be a declaration.
                            Every piece is designed for women who lead with confidence, choose quality over quantity, and understand that
                            true luxury is found in the details.
                        </p>
                        <Link to="/about" className="luxury-link luxury-subheading inline-flex items-center gap-2">
                            Read More <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-foreground text-primary-foreground py-20 md:py-28">
                <div className="luxury-container text-center max-w-xl mx-auto">
                    <p className="luxury-subheading opacity-50 mb-3">Stay Connected</p>
                    <h2 className="font-heading text-3xl md:text-4xl mb-4">Join Our Inner Circle</h2>
                    <p className="text-sm opacity-70 font-body mb-8">
                        Be the first to discover new collections, exclusive offers, and the stories behind each piece.
                    </p>
                    <div className="flex max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 bg-transparent border border-primary-foreground/20 px-4 py-3 text-sm font-body placeholder:opacity-40 focus:outline-none focus:border-primary-foreground/50"
                        />
                        <button className="bg-primary-foreground text-foreground px-6 py-3 text-xs font-body tracking-[0.15em] uppercase hover:opacity-90 transition-opacity">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Index;
