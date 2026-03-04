import { Link } from "react-router-dom";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    image?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Link to={`/product/${product.slug}`} className="group block">
            <div className="aspect-[4/5] bg-secondary/50 mb-4 overflow-hidden relative">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>
            <h3 className="font-heading text-lg mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
            <p className="text-sm text-muted-foreground font-body">${product.price.toFixed(2)}</p>
        </Link>
    );
}
