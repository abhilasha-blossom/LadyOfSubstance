import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Automatically log them in with the returned token
            login(data.token, data.user);
            navigate("/");
        } catch (err: any) {
            setError(err.message || "An error occurred during registration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="luxury-container py-24 md:py-32 flex justify-center items-center">
                <div className="w-full max-w-md bg-secondary/10 p-8 md:p-12 border border-border/50">
                    <div className="text-center mb-8">
                        <h1 className="font-heading text-3xl mb-2">Create Account</h1>
                        <p className="text-muted-foreground font-body text-sm">Join LadyOfSubstance</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm font-body p-3 text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-muted-foreground">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 text-xs tracking-[0.2em] uppercase font-body mt-4 flex justify-center items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-300 font-medium cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #C6A75E, #E6D3A3)', color: '#FDFDFD' }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
                            onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1'; }}
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-body text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="transition-colors underline underline-offset-4" style={{ color: '#C6A75E' }} onMouseEnter={e => e.currentTarget.style.color = '#B8966A'} onMouseLeave={e => e.currentTarget.style.color = '#C6A75E'}>
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
