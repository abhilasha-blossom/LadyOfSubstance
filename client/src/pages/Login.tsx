import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            login(data.token, data.user);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || "An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="luxury-container py-24 md:py-32 flex justify-center items-center">
                <div className="w-full max-w-md bg-secondary/10 p-8 md:p-12 border border-border/50">
                    <div className="text-center mb-8">
                        <h1 className="font-heading text-3xl mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground font-body text-sm">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm font-body p-3 text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-foreground text-primary-foreground py-4 text-xs tracking-[0.2em] uppercase font-body hover:bg-primary hover:text-foreground transition-colors mt-4 flex justify-center items-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-body text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-foreground hover:text-primary transition-colors underline underline-offset-4">
                            Create one
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
