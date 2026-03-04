import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? "bg-primary/10 text-primary border-r-2 border-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground";
    };

    return (
        <div className="min-h-screen flex bg-background font-body">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
                <div className="p-6 border-b">
                    <Link to="/" className="font-heading text-lg font-bold tracking-widest text-foreground block mb-1">
                        LADY<span className="text-primary">OF</span>SUBSTANCE
                    </Link>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Admin Portal</p>
                </div>

                <nav className="flex-1 py-6 flex flex-col gap-2">
                    <Link to="/admin" className={`flex items-center gap-3 px-6 py-3 transition-all ${isActive("/admin")}`}>
                        <LayoutDashboard size={18} />
                        <span className="text-sm font-medium tracking-wide">Overview</span>
                    </Link>
                    <Link to="/admin/products" className={`flex items-center gap-3 px-6 py-3 transition-all ${isActive("/admin/products")}`}>
                        <Package size={18} />
                        <span className="text-sm font-medium tracking-wide">Products</span>
                    </Link>
                    <Link to="/admin/orders" className={`flex items-center gap-3 px-6 py-3 transition-all ${isActive("/admin/orders")}`}>
                        <ShoppingCart size={18} />
                        <span className="text-sm font-medium tracking-wide">Orders</span>
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-muted-foreground tracking-wide hover:text-destructive transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 md:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
