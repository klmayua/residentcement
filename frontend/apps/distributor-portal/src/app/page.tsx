import Link from "next/link";
import {
  Building2,
  TrendingUp,
  Package,
  Truck,
  CreditCard,
  BarChart3,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Product Catalog",
    description: "Browse real-time inventory and pricing for all cement products",
  },
  {
    icon: CreditCard,
    title: "Digital Payments",
    description: "Secure payment processing via card, bank transfer, or USSD",
    icon: Truck,
    title: "Order Tracking",
    description: "Real-time visibility into order status and delivery updates",
  },
  {
    icon: TrendingUp,
    title: "Credit Management",
    description: "View credit limits, outstanding balances, and payment history",
  },
];

const stats = [
  { label: "Active Distributors", value: "2,500+" },
  { label: "Orders Processed", value: "1.2M+" },
  { label: "Delivery Success Rate", value: "99.2%" },
  { label: "Uptime Guarantee", value: "99.9%" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cement-50 to-white">
      {/* Navigation */}
      <header className="border-b border-cement-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-cement-900">
                Resident Cement
              </h1>
              <p className="text-xs text-cement-500">Digital Ecosystem</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-cement-600 hover:text-brand-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#stats"
              className="text-sm text-cement-600 hover:text-brand-primary transition-colors"
            >
              Impact
            </Link>
            <Link
              href="/login"
              className="text-sm text-cement-600 hover:text-brand-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-primaryDark transition-all hover:shadow-lg"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-brand-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-sm font-medium mb-8 animate-fade-in">
              <Shield className="w-4 h-4" />
              Enterprise-Grade Security
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-cement-900 leading-tight mb-6 animate-slide-up">
              Building Tomorrow&apos;s
              <span className="text-brand-primary block">Cement Distribution</span>
            </h1>
            <p className="text-xl text-cement-600 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Streamline your cement distribution with our digital platform. 
              Real-time ordering, smart pricing, and seamless logistics—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primaryDark transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-cement-200 text-cement-700 font-semibold rounded-xl hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-cement-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-cement-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-cement-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-cement-600 max-w-2xl mx-auto">
              A comprehensive digital ecosystem designed specifically for cement distribution
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 bg-white rounded-2xl border border-cement-100 hover:border-brand-primary/30 hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-brand-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-cement-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-cement-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-cement-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-cement-900 mb-6">
                Built for Modern Distribution
              </h2>
              <div className="space-y-6">
                {[
                  "Real-time inventory visibility across all depots",
                  "Automated pricing with volume discounts",
                  "Instant credit limit checks and approvals",
                  "Seamless payment integration with Nigerian banks",
                  "24/7 USSD support for feature phones",
                  "Advanced analytics and reporting dashboard",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span className="text-cement-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-cement-100 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="w-72 h-72 bg-gradient-to-br from-brand-primary to-brand-primaryLight rounded-2xl shadow-2xl flex items-center justify-center">
                  <BarChart3 className="w-32 h-32 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-cement-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-success/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-brand-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cement-900">+47%</div>
                    <div className="text-sm text-cement-500">Order Efficiency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-brand-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-6">
            Ready to Transform Your Distribution?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join thousands of distributors already benefiting from our digital platform
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-brand-primary font-semibold rounded-xl hover:bg-cement-50 transition-all hover:shadow-xl"
            >
              Create Account
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-brand-primaryLight text-white font-semibold rounded-xl hover:bg-brand-primaryDark transition-all border border-white/20"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cement-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Resident Cement
                  </h3>
                  <p className="text-xs text-cement-400">Digital Ecosystem</p>
                </div>
              </div>
              <p className="text-cement-400 text-sm leading-relaxed">
                Transforming cement distribution across Nigeria with innovative 
                digital solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">Features</Link></li>
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">Integrations</Link></li>
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">About</Link></li>
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">Careers</Link></li>
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">Help Center</Link></li>
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">Documentation</Link></li>
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">Contact</Link></li>
                <li><Link href="#" className="text-cement-400 hover:text-white transition-colors text-sm">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-cement-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cement-500 text-sm">
              © 2026 Resident Cement. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-cement-500 hover:text-white transition-colors text-sm">Privacy</Link>
              <Link href="#" className="text-cement-500 hover:text-white transition-colors text-sm">Terms</Link>
              <Link href="#" className="text-cement-500 hover:text-white transition-colors text-sm">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
