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
        <div className="min-h-screen flex flex-col font-body selection:bg-primary/20 selection:text-foreground">
            {/* Top Announcement Bar */}
            <div className="bg-foreground text-primary-foreground py-1.5 text-center text-[10px] tracking-[0.3em] font-body uppercase relative z-50">
                <span className="opacity-80">Complimentary Nationwide Shipping on orders over ₹500</span>
            </div>

            <header className="absolute top-8 left-0 right-0 z-50 w-full hover:bg-white/50 transition-colors duration-500">
                <div className="luxury-container flex h-20 items-center justify-between">
                    <Link to="/" className="font-heading text-2xl font-medium tracking-widest flex items-center gap-2 group" style={{ color: '#2C2219' }}>
                        <span className="transition-opacity group-hover:opacity-80">LADY<span className="editorial-italic" style={{ color: '#C6A75E' }}>OF</span>SUBSTANCE</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/shop" className="text-sm tracking-widest transition-colors font-medium" style={{ color: '#2C2219' }} onMouseEnter={e => e.currentTarget.style.color = '#C6A75E'} onMouseLeave={e => e.currentTarget.style.color = '#2C2219'}>SHOP</Link>
                        <Link to="/about" className="text-sm tracking-widest transition-colors font-medium" style={{ color: '#2C2219' }} onMouseEnter={e => e.currentTarget.style.color = '#C6A75E'} onMouseLeave={e => e.currentTarget.style.color = '#2C2219'}>OUR STORY</Link>
                        <Link to="/cart" className="text-sm tracking-widest transition-colors relative flex items-center font-medium" style={{ color: '#2C2219' }} onMouseEnter={e => e.currentTarget.style.color = '#C6A75E'} onMouseLeave={e => e.currentTarget.style.color = '#2C2219'}>
                            CART
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 text-[10px] w-4 h-4 flex items-center justify-center rounded-full" style={{ backgroundColor: '#2C2219', color: '#fff' }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/account" className="text-sm tracking-widest transition-colors font-medium" style={{ color: '#2C2219' }}>ACCOUNT</Link>
                                <button onClick={handleLogout} className="text-sm tracking-widest transition-colors font-medium" style={{ color: '#2C2219' }}>LOGOUT</button>
                            </>
                        ) : (
                            <Link to="/login" className="text-sm tracking-widest px-5 py-2 transition-all duration-300 font-medium" style={{ border: '1px solid rgba(44,34,25,0.3)', color: '#2C2219' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2C2219'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#2C2219'; }}>LOGIN</Link>
                        )}
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
            <footer className="bg-foreground text-primary-foreground pt-20 pb-12 mt-auto">
                <div className="luxury-container">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="font-heading text-2xl mb-4">LADY<span className="editorial-italic text-primary">OF</span>SUBSTANCE</h3>
                            <p className="font-body text-sm opacity-60 leading-relaxed max-w-sm">
                                Curating eternal elegance for the modern woman. Discover fine jewelry crafted with intention, designed for a lifetime.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-body text-xs tracking-[0.2em] uppercase mb-6 opacity-80">Information</h4>
                            <ul className="space-y-4 text-sm opacity-60">
                                <li><Link to="/about" className="hover:text-primary transition-colors hover:opacity-100">Our Heritage</Link></li>
                                <li><Link to="/shop" className="hover:text-primary transition-colors hover:opacity-100">Care Guide</Link></li>
                                <li><Link to="/shop" className="hover:text-primary transition-colors hover:opacity-100">Shipping & Returns</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-body text-xs tracking-[0.2em] uppercase mb-6 opacity-80">Connect</h4>
                            <ul className="space-y-4 text-sm opacity-60">
                                <li><a href="#" className="hover:text-primary transition-colors hover:opacity-100">Instagram</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors hover:opacity-100">Pinterest</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors hover:opacity-100">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-40 font-body">
                        <p>© {new Date().getFullYear()} LadyOfSubstance. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
