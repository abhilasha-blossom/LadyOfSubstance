import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Package, ShoppingCart, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    recentOrders: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch all orders and calculate stats
                const ordersRes = await fetch("http://localhost:5000/api/orders", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const orders = await ordersRes.json();

                const productsRes = await fetch("http://localhost:5000/api/products");
                const products = await productsRes.json();

                // Calculate Revenue (only from Paid orders)
                const revenue = orders
                    .filter((o: any) => o.paymentStatus === "PAID")
                    .reduce((sum: number, order: any) => sum + order.totalAmount, 0);

                setStats({
                    totalRevenue: revenue,
                    totalOrders: orders.length,
                    totalProducts: products.length,
                    recentOrders: orders.slice(0, 5) // Get latest 5
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    if (loading || !stats) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-full min-h-[50vh]">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="font-heading text-3xl mb-2">Dashboard Overview</h1>
                <p className="text-muted-foreground">Welcome to the LadyOfSubstance admin portal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-card border p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</h3>
                        <DollarSign size={20} className="text-primary" />
                    </div>
                    <p className="text-3xl font-heading">${stats.totalRevenue.toFixed(2)}</p>
                </div>

                <div className="bg-card border p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Orders</h3>
                        <ShoppingCart size={20} className="text-primary" />
                    </div>
                    <p className="text-3xl font-heading">{stats.totalOrders}</p>
                </div>

                <div className="bg-card border p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Products</h3>
                        <Package size={20} className="text-primary" />
                    </div>
                    <p className="text-3xl font-heading">{stats.totalProducts}</p>
                </div>

                <div className="bg-card border p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Conversion</h3>
                        <TrendingUp size={20} className="text-primary" />
                    </div>
                    <p className="text-3xl font-heading">+12%</p>
                </div>
            </div>

            <div className="bg-card border w-full">
                <div className="p-6 border-b">
                    <h2 className="font-heading text-xl">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/30 text-muted-foreground uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Payment</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-t">
                            {stats.recentOrders.map(order => (
                                <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                                    <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">${order.totalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm ${order.orderStatus === 'DELIVERED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {stats.recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No recent orders.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
