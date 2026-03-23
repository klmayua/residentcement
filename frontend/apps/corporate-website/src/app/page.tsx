import Link from "next/link";
import {
  Building2,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Package,
  Users,
  Award,
  TrendingUp,
  Verified,
  Leaf,
  Globe,
  Diamond,
  Architecture,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Diamond,
    title: "Product Quality",
    description: "Nano-engineered aggregates ensuring compressive strength that exceeds global industrial standards by 40%.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Carbon-neutral manufacturing processes and recycled raw materials for the next century of green building.",
  },
  {
    icon: Truck,
    title: "B2B Logistics",
    description: "Real-time supply chain tracking and automated fleet management for seamless site delivery integration.",
  },
];

const stats = [
  { value: "$500M", label: "Investment", icon: Package },
  { value: "10M", label: "Tons/Year Capacity", icon: Users },
  { value: "2025", label: "Production Start", icon: Award },
  { value: "36", label: "States Coverage", icon: TrendingUp },
];

const products = [
  {
    name: "Elite Portland",
    grade: "Type GU",
    description: "Premium minimalist cement for structural applications and major construction projects",
    price: "$24.50",
    unit: "unit",
  },
  {
    name: "Monolith Blocks",
    grade: "Pre-Cast",
    description: "Perfect geometric concrete blocks for foundational and architectural applications",
    price: "$112.00",
    unit: "block",
  },
  {
    name: "Titanium Grit",
    grade: "Aggregate",
    description: "High-quality sand and gravel aggregate for premium concrete mixes",
    price: "$85.00",
    unit: "ton",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Bleed with Gradient Overlay */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-surface-dim">
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-24 max-w-7xl mx-auto">
          <span className="text-primary-container font-label tracking-[0.3em] uppercase mb-6 block">
            Industrial Excellence
          </span>

          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-white font-black leading-[0.9] tracking-tighter mb-8 max-w-4xl">
            Built for
            <br />
            <span className="text-primary-container">Generations</span>
          </h1>

          <p className="text-surface-bright text-lg md:text-xl max-w-xl font-body font-light leading-relaxed mb-12 opacity-90">
            Architectural grade foundations engineered for permanence. We provide the structural soul for tomorrow&apos;s landmarks.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/contact/">
              <Button size="lg" className="btn-gold px-10 py-6 text-sm font-bold uppercase tracking-[0.2em]">
                Request Quote
              </Button>
            </Link>
            <Link href="/products/">
              <Button
                size="lg"
                variant="ghost"
                className="border border-white/30 backdrop-blur-md text-white px-10 py-6 hover:bg-white/10"
              >
                Explore Materials
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.4em] mb-4">Discovery</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface-container py-8 border-b border-outline-variant/10">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-headline font-black text-foreground tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-label text-on-surface-variant">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-10 bg-surface-container-low rounded-lg border-l-2 border-primary-container/30 hover:bg-surface-container-lowest transition-all group"
              >
                <feature.icon className="h-10 w-10 text-primary mb-8" />
                <h3 className="font-headline text-2xl font-bold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-8 h-[1px] w-0 group-hover:w-full bg-primary transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Materials Section */}
      <section className="bg-surface-container py-20 md:py-32">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-label text-primary mb-4 block">Our Materials</span>
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight"
              >
                The Foundation of Modern Infrastructure
              </h2>
              <p className="text-on-surface-variant text-lg">
                Refined for specific architectural needs and engineered for structural permanence.
              </p>
            </div>
            <Link href="/products/" className="group flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm whitespace-nowrap"
            >
              View Catalog
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-surface-container-lowest p-4 rounded-lg group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square bg-surface-container rounded-lg mb-6 overflow-hidden flex items-center justify-center"
                >
                  <Package className="h-20 w-20 text-outline-variant group-hover:text-primary transition-colors duration-500" />
                </div>
                <span className="text-[10px] text-outline font-bold uppercase tracking-widest">
                  {product.grade}
                </span>
                <h4 className="font-headline text-xl font-bold mt-1 text-foreground">
                  {product.name}
                </h4>
                <p className="text-on-surface-variant text-sm mt-2 mb-4">{product.description}</p>
                <p className="text-primary font-bold">
                  {product.price}{" "}
                  <span className="text-on-surface-variant font-normal text-xs">
                    / {product.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="bg-surface-container-low py-20 md:py-32">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] bg-surface-container-highest rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-cement-300 to-cement-400 flex items-center justify-center"
                >
                  <Architecture className="h-32 w-32 text-cement-600" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary p-6 flex flex-col justify-end">
                <span className="text-4xl font-headline font-black text-on-primary leading-none">
                  2025
                </span>
                <span className="text-xs uppercase font-bold text-on-primary tracking-widest mt-2">
                  Production Start
                </span>
              </div>
            </div>

            <div className="lg:pl-8">
              <span className="text-label text-primary mb-4 block">Our Heritage</span>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-8"
              >
                Engineering Nigeria&apos;s Future
              </h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed text-lg"
              >
                Resident Cement Company Limited is building a $500 million world-class cement plant in Bauchi State, Nigeria. With 10 million tonnes annual capacity, we are positioned to transform Nigeria&apos;s construction industry.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <Verified className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">Purity of Material</h4>
                    <p className="text-sm text-on-surface-variant">
                      Strategic partnership with Sinoma Nigeria Company brings world-class technology and expertise.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <Globe className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">Architectural Trust</h4>
                    <p className="text-sm text-on-surface-variant">
                      Sustainable energy with 100-150MW captive power plant, setting a new industry standard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-foreground text-surface">
        <div className="container-wide mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-label text-primary-container mb-4 block">Testimonials</span>
            <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-6"
            >
              Industry Recognition
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "The Bauchi cement plant represents a major milestone for Nigeria's infrastructure development. Resident Cement is positioned to transform the industry.",
                author: "Industry Analyst",
                role: "Global Cement Review",
              },
              {
                quote: "The strategic partnership with Sinoma Nigeria Company brings world-class technology and expertise to cement production in Nigeria.",
                author: "Construction Expert",
                role: "Nigeria Infrastructure Summit",
              },
              {
                quote: "Resident Cement's commitment to sustainable energy with their captive power plant sets a new standard for the industry.",
                author: "Energy Consultant",
                role: "West African Power Initiative",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.author}
                className="bg-surface-container-high/50 backdrop-blur-sm rounded-lg p-8 border border-outline-variant/10"
              >
                <CheckCircle className="h-8 w-8 text-primary-container mb-6" />
                <blockquote className="text-surface-bright mb-6 leading-relaxed"
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div>
                  <div className="font-headline font-bold">{testimonial.author}</div>
                  <div className="text-sm text-surface-variant/70">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Gold Monolith */}
      <section className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="container-wide mx-auto relative overflow-hidden rounded-lg"
        >
          <div
            className="p-12 md:p-20 flex flex-col md:flex-row items-center justify-between relative"
            style={{
              background: "linear-gradient(45deg, #745B17, #C5A55A)",
            }}
          >
            {/* Decorative circle */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-xl text-center md:text-left mb-10 md:mb-0">
              <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold text-on-primary mb-6"
              >
                Ready to break ground?
              </h2>
              <p className="text-on-primary/80 text-lg leading-relaxed">
                Join the network of elite builders choosing Resident Cement for structural permanence. Our team is ready to scale with your project.
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-4">
              <Link href="/contact/">
                <Button
                  size="lg"
                  className="bg-on-primary text-primary px-12 py-6 rounded text-sm font-extrabold uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-transform"
                >
                  Request Quote
                </Button>
              </Link>
              <p className="text-on-primary/60 text-[10px] text-center uppercase tracking-widest">
                Average response time: 2 hours
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
