const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    bestseller: boolean;
    createdAt: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${slug}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    return response.json();
};
