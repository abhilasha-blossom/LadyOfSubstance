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
        <Link to={`/product/${product.slug}`} className="group block cursor-pointer">
            <div className="aspect-[4/5] bg-secondary/50 mb-5 overflow-hidden relative">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.15] transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
            </div>
            <h3 className="font-heading text-lg mb-1.5 group-hover:text-primary transition-colors">{product.name}</h3>
            <p className="text-sm text-muted-foreground font-body tracking-wider">${product.price.toFixed(2)}</p>
        </Link>
    );
}
