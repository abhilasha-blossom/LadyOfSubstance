import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function About() {
    return (
        <Layout>
            <div className="luxury-container py-12 md:py-20 font-body">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <p className="luxury-subheading mb-4">Our Heritage</p>
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6">
                        The LadyOfSubstance Story
                    </h1>
                    <div className="luxury-divider mx-auto mb-8" />
                    <p className="text-muted-foreground leading-relaxed text-lg">
                        We believe that jewelry is more than an accessory. It is a testament to the journeys we take, the milestones we conquer, and the quiet strength we carry every day.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="aspect-[4/5] overflow-hidden bg-secondary">
                        <img
                            src="/images/about.jpeg"
                            alt="Craftsmanship"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="font-heading text-3xl">Crafted With Intention</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Every piece at LadyOfSubstance is designed with meticulous attention to detail. We responsibly source our metals and hand-select our stones to ensure that your jewelry doesn't just look exquisite—it endures.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Our founders started this brand to rebel against the fast-fashion narrative. We want you to invest in pieces that reflect your character: strong, brilliant, and undeniably authentic.
                        </p>
                    </div>
                </div>

                <div className="bg-secondary/30 p-12 md:p-20 text-center mb-24">
                    <h2 className="font-heading text-3xl mb-6">"Elegance is not about being noticed, it's about being remembered."</h2>
                    <p className="luxury-subheading opacity-70">A Promise of Quality</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-center mb-20">
                    <div className="p-6">
                        <h3 className="font-heading text-xl mb-4">Ethical Sourcing</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            We trace our materials back to their origins, ensuring fair practices and conflict-free gemstones for every collection.
                        </p>
                    </div>
                    <div className="p-6 border-x border-border/50">
                        <h3 className="font-heading text-xl mb-4">Master Craftsmanship</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Working alongside generations of artisan jewelers, our designs marry traditional techniques with modern minimalism.
                        </p>
                    </div>
                    <div className="p-6">
                        <h3 className="font-heading text-xl mb-4">Lifetime Value</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Created with solid gold and premium zirconia, our pieces are hypoallergenic, waterproof, and crafted for everyday wear.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        to="/shop"
                        className="px-10 py-4 text-xs tracking-[0.2em] uppercase font-body inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                        style={{ background: 'linear-gradient(135deg, #C6A75E, #E6D3A3)', color: '#FDFDFD' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                        Explore The Collections <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
