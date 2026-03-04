import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Layout({ children }: { children: ReactNode }) {
    const { getCartCount } = useCart();
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const cartCount = getCartCount();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col font-body">
            <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
                <div className="luxury-container flex h-16 items-center justify-between">
                    <Link to="/" className="font-heading text-xl font-bold tracking-widest text-foreground">
                        LADY<span className="text-primary">OF</span>SUBSTANCE
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/shop" className="text-sm tracking-widest hover:text-primary transition-colors">SHOP</Link>
                        <Link to="/about" className="text-sm tracking-widest hover:text-primary transition-colors">OUR STORY</Link>
                        <Link to="/cart" className="text-sm tracking-widest hover:text-primary transition-colors relative flex items-center">
                            CART
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/account" className="text-sm tracking-widest hover:text-primary transition-colors">ACCOUNT</Link>
                                <button onClick={handleLogout} className="text-sm tracking-widest hover:text-primary transition-colors">LOGOUT</button>
                            </>
                        ) : (
                            <Link to="/login" className="text-sm tracking-widest hover:text-primary transition-colors bg-foreground text-primary-foreground px-4 py-2 hover:bg-primary hover:text-foreground">LOGIN</Link>
                        )}
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
            <footer className="bg-secondary/50 py-12 text-center mt-auto">
                <div className="luxury-container">
                    <p className="text-sm opacity-60">© 2026 LadyOfSubstance. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
