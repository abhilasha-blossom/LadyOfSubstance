import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:5000/api/orders", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error("Failed to update status");

            // Update local state instead of full refetch for smoother UX
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
        } catch (error) {
            console.error(error);
            alert("Failed to update order status");
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="font-heading text-3xl mb-2">Orders</h1>
                <p className="text-muted-foreground">View and manage customer orders.</p>
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
                                    <th className="px-6 py-4 font-medium">Order ID</th>
                                    <th className="px-6 py-4 font-medium">Customer (User ID)</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Total</th>
                                    <th className="px-6 py-4 font-medium">Payment</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-t">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <span className="block truncate max-w-[150px]" title={order.userId}>{order.userId}</span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium">${order.totalAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="bg-transparent border text-xs uppercase tracking-widest focus:outline-none focus:border-primary p-1"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="PROCESSING">Processing</option>
                                                <option value="SHIPPED">Shipped</option>
                                                <option value="DELIVERED">Delivered</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            No orders found in the system.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
