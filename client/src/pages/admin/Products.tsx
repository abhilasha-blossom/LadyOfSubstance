import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { token } = useAuth();

    // Form State
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        slug: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        bestseller: false,
        images: [] as string[]
    });
    const [imageUrl, setImageUrl] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:5000/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const resetForm = () => {
        setFormData({
            id: "", name: "", slug: "", description: "", price: "",
            category: "", stock: "", bestseller: false, images: []
        });
        setImageUrl("");
    };

    const handleOpenModal = (product: any = null) => {
        if (product) {
            setFormData({
                ...product,
                price: product.price.toString(),
                stock: product.stock.toString()
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        const checked = type === "checkbox" ? e.target.checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleAddImage = () => {
        if (imageUrl) {
            setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
            setImageUrl("");
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const isEditing = !!formData.id;
            const url = isEditing
                ? `http://localhost:5000/api/products/${formData.id}`
                : "http://localhost:5000/api/products";

            const payload = {
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                stock: parseInt(formData.stock, 10),
                bestseller: formData.bestseller,
                images: formData.images
            };

            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to save product");
            }

            handleCloseModal();
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Failed to save product. Check console.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchProducts();
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-heading text-3xl mb-2">Products</h1>
                    <p className="text-muted-foreground">Manage your storefront inventory.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-foreground text-primary-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase font-body hover:bg-primary hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-32">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : (
                <div className="bg-card w-full border font-body">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/30 text-muted-foreground uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Product</th>
                                    <th className="px-6 py-4 font-medium">Category</th>
                                    <th className="px-6 py-4 font-medium">Price</th>
                                    <th className="px-6 py-4 font-medium">Stock</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-t">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-secondary/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-secondary flex items-center justify-center shrink-0">
                                                    {product.images[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon size={16} className="text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="font-medium text-foreground">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground capitalize">{product.category}</td>
                                        <td className="px-6 py-4">${parseFloat(product.price).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={product.stock < 5 ? "text-destructive font-bold" : ""}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.bestseller && (
                                                <span className="bg-primary/20 text-primary px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm">Bestseller</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => handleOpenModal(product)} className="text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            No products found. Click "Add Product" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card border w-full max-w-2xl max-h-[90vh] overflow-y-auto font-body shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-card z-10">
                            <h2 className="font-heading text-2xl">{formData.id ? "Edit Product" : "Add New Product"}</h2>
                            <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
                                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-2 focus:outline-none focus:border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Slug (Optional)</label>
                                    <input name="slug" value={formData.slug} onChange={handleInputChange} placeholder="Auto-generated if empty" className="w-full bg-transparent border px-4 py-2 focus:outline-none focus:border-primary" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-muted-foreground">Description</label>
                                <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-transparent border px-4 py-2 focus:outline-none focus:border-primary" />
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Price ($)</label>
                                    <input required type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-2 focus:outline-none focus:border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Category</label>
                                    <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-2 focus:outline-none focus:border-primary">
                                        <option value="">Select Category</option>
                                        <option value="necklaces">Necklaces</option>
                                        <option value="rings">Rings</option>
                                        <option value="earrings">Earrings</option>
                                        <option value="bracelets">Bracelets</option>
                                        <option value="bridal">Bridal</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Stock</label>
                                    <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full bg-transparent border px-4 py-2 focus:outline-none focus:border-primary" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs uppercase tracking-widest text-muted-foreground block">Images (URLs)</label>
                                <div className="flex gap-2">
                                    <input
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="flex-1 bg-transparent border px-4 py-2 focus:outline-none focus:border-primary text-sm"
                                    />
                                    <button type="button" onClick={handleAddImage} className="bg-secondary px-4 py-2 text-xs tracking-wider uppercase hover:bg-primary hover:text-foreground transition-colors">Add</button>
                                </div>
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                        {formData.images.map((url, i) => (
                                            <div key={i} className="relative aspect-square border group">
                                                <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t">
                                <input
                                    type="checkbox"
                                    id="bestseller"
                                    name="bestseller"
                                    checked={formData.bestseller}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 accent-primary"
                                />
                                <label htmlFor="bestseller" className="text-sm font-medium">Mark as Bestseller</label>
                            </div>

                            <div className="pt-6 border-t flex justify-end gap-4">
                                <button type="button" onClick={handleCloseModal} className="px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-secondary transition-colors">Cancel</button>
                                <button type="submit" className="bg-foreground text-primary-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-foreground transition-colors">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
