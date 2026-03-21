import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Building2,
    title: "Premium Quality",
    description: "Grade-A cement products meeting international standards",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Nationwide delivery within 48 hours",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Multiple payment options with bank-grade security",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer service",
  },
];

const stats = [
  { value: "50,000+", label: "Tons Delivered", icon: Package },
  { value: "1,200+", label: "Happy Clients", icon: Users },
  { value: "15+", label: "Years Experience", icon: Award },
  { value: "98%", label: "Satisfaction Rate", icon: TrendingUp },
];

const products = [
  {
    name: "Dangote Cement 42.5R",
    grade: "Premium",
    description: "High-strength cement for structural applications",
    price: "₦4,500",
    unit: "per bag",
  },
  {
    name: "Dangote Cement 32.5R",
    grade: "Standard",
    description: "General purpose cement for plastering and masonry",
    price: "₦4,200",
    unit: "per bag",
  },
  {
    name: "Dangote Cement 52.5R",
    grade: "High Strength",
    description: "Ultra-high strength for demanding projects",
    price: "₦5,200",
    unit: "per bag",
  },
];

const testimonials = [
  {
    quote: "ResidentCement transformed our supply chain. Reliable delivery and excellent quality.",
    author: "Engr. Adebayo Johnson",
    role: "CEO, Johnson Construction Ltd",
  },
  {
    quote: "The best cement distributor we've worked with. Professional service every time.",
    author: "Mrs. Nkechi Okafor",
    role: "Director, Okafor Estates",
  },
  {
    quote: "Their platform makes ordering so easy. Real-time tracking is a game-changer.",
    author: "Mr. Ibrahim Musa",
    role: "Procurement Manager, Musa Builders",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-brand-dark via-brand-secondary to-brand-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm font-medium">Now Serving All 36 States</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Building Nigeria's Future with
              <span className="text-brand-accent"> Premium Cement</span>
            </h1>

            <p className="text-lg md:text-xl text-cement-200 mb-8 max-w-2xl mx-auto">
              Nigeria's premier cement distribution platform. Quality products,
              reliable delivery, and innovative solutions for construction professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products/">
                <Button size="lg" className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90">
                  View Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact/">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-brand-accent" />
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-cement-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cement-900 mb-4">
              Why Choose Resident
              <span className="text-brand-primary">Cement</span>?
            </h2>
            <p className="text-cement-600">
              We combine quality products with exceptional service to deliver
              the best cement distribution experience in Nigeria.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-cement-50 hover:bg-brand-light transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <feature.icon className="h-6 w-6 text-brand-primary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-cement-900 mb-2">{feature.title}</h3>
                <p className="text-cement-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-cement-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-cement-900 mb-4">
                Our Products
              </h2>
              <p className="text-cement-600">
                Premium cement grades suitable for all construction needs,
                from residential buildings to major infrastructure projects.
              </p>
            </div>
            <Link href="/products/" className="mt-4 md:mt-0">
              <Button variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-cement-200 to-cement-300 flex items-center justify-center">
                  <Package className="h-20 w-20 text-cement-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary">
                      {product.grade}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-cement-900 mb-2">{product.name}</h3>
                  <p className="text-cement-600 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-brand-primary">{product.price}</span>
                      <span className="text-cement-500 text-sm"> / {product.unit}</span>
                    </div>
                    <Link href="/contact/">
                      <Button size="sm">Get Quote</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cement-900 mb-4">
              How It Works
            </h2>
            <p className="text-cement-600">
              Simple, transparent process from order to delivery
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Browse Products", desc: "Explore our catalog" },
              { step: "02", title: "Request Quote", desc: "Get competitive pricing" },
              { step: "03", title: "Place Order", desc: "Confirm and pay securely" },
              { step: "04", title: "Receive Delivery", desc: "Track in real-time" },
            ].map((item, idx) => (
              <div key={item.step} className="text-center relative">
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-cement-200"></div>
                )}
                <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-cement-900 mb-1">{item.title}</h3>
                <p className="text-cement-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-cement-300">
              Trusted by leading construction companies across Nigeria
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <CheckCircle className="h-8 w-8 text-brand-accent mb-4" />
                <blockquote className="text-cement-100 mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-cement-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>

          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers. Get a quote today and
            experience the ResidentCement difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact/">
              <Button size="lg" className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90">
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="tel:+2341234567890">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Call Us Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
