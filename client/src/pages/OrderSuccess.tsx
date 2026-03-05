import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <Layout>
            <div className="luxury-container py-24 md:py-32 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 size={40} className="text-green-600" />
                </div>

                <p className="luxury-subheading mb-4">Thank you for your purchase</p>
                <h1 className="font-heading text-4xl md:text-5xl mb-6">Order Confirmed</h1>

                <div className="bg-secondary/20 p-8 w-full max-w-md mb-10 border border-border/50">
                    <div className="space-y-4 font-body text-sm">
                        <div className="flex justify-between border-b pb-4">
                            <span className="text-muted-foreground">Order ID</span>
                            <span className="font-medium text-foreground">{orderId || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-4">
                            <span className="text-muted-foreground">Payment Status</span>
                            <span className="font-medium text-green-600">Paid Successfully</span>
                        </div>
                        <div className="pt-2 text-muted-foreground">
                            A confirmation email has been sent to your email address with the order details and tracking information.
                        </div>
                    </div>
                </div>

                <Link
                    to="/shop"
                    className="py-4 px-12 text-xs tracking-[0.2em] uppercase font-body inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                    style={{ background: 'linear-gradient(135deg, #C6A75E, #E6D3A3)', color: '#FDFDFD' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                    Continue Shopping <ArrowRight size={14} />
                </Link>
            </div>
        </Layout>
    );
}
