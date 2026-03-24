import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/services/api";
import type { Product } from "@/services/api";
import { ArrowRight, Loader2 } from "lucide-react";

const categoryData = [
    { name: "Rings", image: "/images/product-ring.jpg" },
    { name: "Necklaces", image: "/images/product-necklace.jpg" },
    { name: "Earrings", image: "/images/product-earrings.jpg" },
    { name: "Bracelets", image: "/images/product-bracelet.jpg" },
    { name: "Bridal", image: "/images/category-bridal.png" }
];

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
            <section className="relative h-[100svh] min-h-[600px] flex items-start md:items-center justify-center overflow-hidden">
                <img
                    src="/images/hero.png"
                    alt="Lady of Substance hero"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: 'center 80%' }}
                />
                {/* Very soft champagne overlay — lets the image breathe */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(248,245,240,0.2) 0%, rgba(248,245,240,0.05) 40%, rgba(248,245,240,0.0) 60%, rgba(248,245,240,0.15) 100%)' }}
                />

                {/* Hero text - responsive positioning to stay above the necklace on mobile, centered on desktop */}
                <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-5xl mx-auto pt-[20vh] sm:pt-32 md:pt-0 pb-12">
                    {/* Eyebrow — charcoal */}
                    <p
                        className="font-body text-[10px] sm:text-xs md:text-sm tracking-[0.3em] sm:tracking-[0.45em] uppercase mb-4 sm:mb-5 fade-in-up font-medium"
                        style={{ color: '#2C2219' }}
                    >
                        ✦ &nbsp;The Lady of Substance Boutique&nbsp; ✦
                    </p>
                    {/* Main headline — dark charcoal */}
                    <h1
                        className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6 fade-in-up fade-in-up-delay-1 px-2"
                        style={{ color: '#2C2219', textShadow: '0 1px 12px rgba(248,245,240,0.8)' }}
                    >
                        Jewelry for those<br />
                        <span className="italic font-medium" style={{ color: '#C6A75E' }}>of substance.</span>
                    </h1>
                    {/* Subheadline — elegant dark espresso */}
                    <p
                        className="font-body text-xs sm:text-sm md:text-base mb-8 sm:mb-10 max-w-xs sm:max-w-md mx-auto fade-in-up fade-in-up-delay-1 font-medium px-4"
                        style={{ color: '#4A3728', letterSpacing: '0.04em', textShadow: '0 1px 6px rgba(248,245,240,0.6)' }}
                    >
                        Handcrafted fine jewelry for those who value timeless elegance.
                    </p>
                    {/* CTA button — metallic champagne gradient */}
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-10 py-3 sm:py-4 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase font-body font-medium transition-all duration-400 fade-in-up fade-in-up-delay-2 shadow-lg hover:shadow-xl"
                        style={{ background: 'linear-gradient(135deg, #C6A75E, #E6D3A3)', color: '#FDFDFD' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                        Explore Boutique <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            {/* Shimmering Marquee */}
            <div className="marquee-container">
                <div className="marquee-content font-body text-[10px] md:text-xs tracking-[0.3em] uppercase opacity-90" style={{ color: '#4A3728' }}>
                    <span>✧ ETHICALLY SOURCED ✧</span>
                    <span>BESPOKE CRAFTSMANSHIP ✧</span>
                    <span>ETERNAL ELEGANCE ✧</span>
                    <span>SOLID GOLD FOUNDATION ✧</span>
                    <span>ETHICALLY SOURCED ✧</span>
                    <span>BESPOKE CRAFTSMANSHIP ✧</span>
                    <span>ETERNAL ELEGANCE ✧</span>
                    <span>SOLID GOLD FOUNDATION ✧</span>
                </div>
            </div>

            {/* Categories */}
            <section className="luxury-container py-20 md:py-28">
                <div className="text-center mb-14">
                    <p className="luxury-subheading mb-3">Curated For You</p>
                    <h2 className="font-heading text-3xl md:text-4xl">Shop by Category</h2>
                    <div className="luxury-divider mt-4" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 mt-12">
                    {categoryData.map((cat, i) => (
                        <Link
                            key={cat.name}
                            to={`/shop?category=${cat.name}`}
                            className={`group relative bg-secondary flex items-end p-6 overflow-hidden hover:shadow-2xl transition-all duration-700 ${i % 2 === 0 ? 'aspect-[3/4] md:translate-y-8' : 'aspect-square'}`}
                        >
                            <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[2s] ease-out opacity-90" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent group-hover:from-foreground/90 transition-colors duration-500" />
                            <span className="font-heading text-sm md:text-lg tracking-wider text-primary-foreground group-hover:text-primary transition-colors z-10">
                                <span className={i % 2 !== 0 ? 'editorial-italic' : ''}>{cat.name}</span>
                            </span>
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
            {/* Editorial Campaign Gallery */}
            <section className="bg-background py-20 md:py-40 overflow-hidden">
                <div className="luxury-container">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-6">
                        <div>
                            <p className="luxury-subheading mb-4 tracking-[0.3em]">La Collection</p>
                            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1]">
                                The <span className="editorial-italic">Signature</span><br className="hidden md:block" /> Campaign
                            </h2>
                        </div>
                        <Link to="/about" className="group inline-flex items-center gap-4 text-xs tracking-[0.25em] uppercase font-body hover:text-primary transition-colors pb-2 md:pb-4">
                            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-500 group-hover:after:origin-bottom-left group-hover:after:scale-x-100 pb-1">View Lookbook</span>
                            <ArrowRight size={14} className="font-light group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Asymmetrical Masonry/Lookbook Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 lg:gap-16 items-center">
                        {/* Image 1 */}
                        <div className="aspect-[4/5] overflow-hidden bg-secondary relative group md:-translate-y-8">
                            <img src="/images/lookbook-1.png" alt="Campaign Look 1" className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-[2s] ease-out" loading="lazy" />
                            <div className="absolute inset-0 bg-background/0 group-hover:bg-foreground/5 transition-colors duration-500" />
                        </div>
                        {/* Image 2 */}
                        <div className="aspect-[3/4] overflow-hidden bg-secondary relative group mt-4 md:mt-0 md:translate-y-12">
                            <img src="/images/lookbook-2.png" alt="Campaign Look 2" className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-[2s] ease-out" loading="lazy" />
                            <div className="absolute inset-0 bg-background/0 group-hover:bg-foreground/5 transition-colors duration-500" />
                        </div>
                        {/* Image 3 */}
                        <div className="aspect-[4/5] overflow-hidden bg-secondary relative group mt-4 md:mt-0 md:-translate-y-8">
                            <img src="/images/lookbook-3.png" alt="Campaign Look 3" className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-[2s] ease-out" loading="lazy" />
                            <div className="absolute inset-0 bg-background/0 group-hover:bg-foreground/5 transition-colors duration-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Story (Light Luxury Tone) */}
            <section className="bg-secondary/40 text-foreground py-24 md:py-32">
                <div className="luxury-container">
                    <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                        <div className="max-w-xl order-2 md:order-1">
                            <p className="luxury-subheading mb-4 opacity-70">Heritage & Vision</p>
                            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.1] font-light">
                                Crafted for those who <br /><span className="editorial-italic metallic-text">value true elegance.</span>
                            </h2>
                            <div className="h-[1px] w-24 mb-8" style={{ backgroundColor: '#C6A75E' }} />
                            <p className="font-body leading-relaxed mb-10 text-lg" style={{ color: '#6B6B6B' }}>
                                LadyOfSubstance was born from the belief that jewelry should be more than decoration — it should be a declaration.
                                Every piece is designed for individuals who lead with confidence, choose quality over quantity, and understand that
                                true luxury is found in the details.
                            </p>
                            <Link to="/about" className="group inline-flex items-center gap-4 text-xs tracking-[0.25em] uppercase font-body hover:text-primary transition-colors text-foreground">
                                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-500 group-hover:after:origin-bottom-left group-hover:after:scale-x-100 pb-1">Read The Full Story</span>
                                <ArrowRight size={14} className="font-light group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="aspect-[3/4] overflow-hidden order-1 md:order-2 bg-background p-4 shadow-sm">
                            <img src="/images/about.jpeg" alt="LadyOfSubstance brand story" className="w-full h-full object-cover hover:scale-[1.05] transition-transform duration-[2s] ease-out opacity-90" loading="lazy" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-secondary/20 py-24 md:py-32">
                <div className="luxury-container text-center max-w-2xl mx-auto">
                    <p className="luxury-subheading mb-4 text-primary">Exclusive Access</p>
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6 font-light">Join The <span className="editorial-italic">Inner Circle</span></h2>
                    <p className="text-muted-foreground font-body mb-12 text-lg">
                        Be the first to discover new collections, receive private invitations, and uncover the stories behind each crafted piece.
                    </p>
                    <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4 sm:gap-0">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="flex-1 bg-transparent border-b border-border px-4 py-4 text-sm font-body focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
                        />
                        <button className="px-8 py-4 text-xs font-body tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #C6A75E, #E6D3A3)', color: '#FDFDFD' }} onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Index;
