import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Account() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { token, currentUser } = useAuth();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:5000/api/orders", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    return (
        <Layout>
            <div className="luxury-container pt-28 pb-20 font-body minim-h-screen">
                <div className="max-w-4xl mx-auto">
                    {/* Header/Profile */}
                    <div className="border-b pb-10 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4" style={{ borderColor: 'rgba(107,107,107,0.1)' }}>
                        <div>
                            <p className="luxury-subheading mb-2">Welcome Back,</p>
                            <h1 className="font-heading text-3xl md:text-5xl font-light" style={{ color: '#3E3A36' }}>
                                {currentUser?.name || "User"}
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">{currentUser?.email}</p>
                        </div>
                        <div className="text-[10px] tracking-widest uppercase px-3 py-1 bg-primary/10 text-primary font-bold rounded-sm">
                            {currentUser?.role === 'ADMIN' ? 'Administrator' : 'Valued Customer'}
                        </div>
                    </div>

                    {/* Order History */}
                    <div>
                        <h2 className="font-heading text-2xl mb-6 flex items-center gap-2" style={{ color: '#3E3A36' }}>
                            <ShoppingBag size={20} style={{ color: '#C6A75E' }} />
                            Your Order History
                        </h2>

                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="animate-spin text-primary" size={32} />
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="bg-white/40 backdrop-blur-sm border rounded-sm overflow-hidden shadow-sm" style={{ borderColor: 'rgba(198,167,94,0.1)' }}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-secondary/20 text-muted-foreground uppercase tracking-widest text-[10px]">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Order ID</th>
                                                <th className="px-6 py-4 font-medium">Date</th>
                                                <th className="px-6 py-4 font-medium">Total</th>
                                                <th className="px-6 py-4 font-medium">Payment</th>
                                                <th className="px-6 py-4 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y border-t" style={{ borderColor: 'rgba(107,107,107,0.05)' }}>
                                            {orders.map(order => (
                                                <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-foreground text-xs truncate max-w-[120px]" title={order.id}>
                                                        {order.id.split('-')[0]}...
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground text-xs">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium">${order.totalAmount.toFixed(2)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-sm ${order.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                                            {order.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs uppercase tracking-widest text-muted-foreground">
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 border border-dashed rounded-sm" style={{ borderColor: 'rgba(198,167,94,0.2)' }}>
                                <div className="mb-4 text-muted-foreground/40 float-center">
                                    <ShoppingBag size={48} className="mx-auto" />
                                </div>
                                <p className="text-muted-foreground font-body text-sm mb-4">You haven't placed any orders yet.</p>
                                <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase font-body font-medium shadow-md hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #C6A75E, #E6D3A3)', color: '#FDFDFD' }}>
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
