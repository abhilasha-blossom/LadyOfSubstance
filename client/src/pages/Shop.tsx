import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/services/api";
import type { Product } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function Shop() {
    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get("category");

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error loading products", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredProducts = categoryQuery
        ? products.filter((p) => p.category.toLowerCase() === categoryQuery.toLowerCase())
        : products;

    return (
        <Layout>
            <div className="luxury-container py-12 md:py-20">
                <div className="text-center mb-14">
                    <p className="luxury-subheading mb-3">Our Collection</p>
                    <h1 className="font-heading text-4xl md:text-5xl">{categoryQuery ? categoryQuery : 'Shop All'}</h1>
                    <div className="luxury-divider mt-6" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    slug: product.slug,
                                    price: product.price,
                                    image: product.images?.[0] || undefined,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-muted-foreground font-body">
                        No pieces found in the {categoryQuery} collection yet.
                    </div>
                )}
            </div>
        </Layout>
    );
}
