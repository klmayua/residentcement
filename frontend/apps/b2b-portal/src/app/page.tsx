import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#161311]"
    >
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#161311]/70 backdrop-blur-xl border-b border-[#292524]/30"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
        >
          <Link href="/" className="flex items-center gap-2"
          >
            <span className="font-headline text-lg text-[#e9e1dd] tracking-tight"
            >
              Resident<span className="text-[#e5c374]">Ciment</span>
            </span>
            <span className="text-[10px] text-[#57534e] uppercase tracking-[0.2em] border-l border-[#292524] pl-3">B2B Portal</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8"
          >
            <a href="#features" className="text-sm text-[#57534e] hover:text-[#e9e1dd] transition-colors"
            >Features</a>
            <a href="#about" className="text-sm text-[#57534e] hover:text-[#e9e1dd] transition-colors"
            >About</a>
            <a
              href="https://residentcement.nyamabo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#57534e] hover:text-[#e5c374] transition-colors"
            >Main Website</a>
          </nav>

          <div className="flex items-center gap-4"
          >
            <Link
              href="/login"
              className="text-sm text-[#a8a29e] hover:text-[#e9e1dd] transition-colors"
            >
              Sign In
            </Link>
            <a
              href="mailto:partnerships@residentciment.com"
              className="btn-gold text-[10px] py-2.5 px-5"
            >
              Become a Partner
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="pt-32 pb-20 px-6"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(229,195,116,0.06) 0%, transparent 60%), #161311',
        }}
      >
        <div className="max-w-7xl mx-auto"
        >
          <div className="text-center max-w-4xl mx-auto"
          >
            <p className="text-[#e5c374] text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
            >
              Resident Ciment Bauchi Ltd
            </p>
            <h1 className="font-headline text-5xl md:text-7xl font-black text-[#e9e1dd] leading-tight mb-6 tracking-tight"
            >
              Enterprise Cement
              <br />
              <span className="text-[#e5c374]">Procurement Simplified</span>
            </h1>
            <p className="text-lg text-[#57534e] max-w-2xl mx-auto mb-10"
            >
              Streamline your construction supply chain with our B2B portal.
              Get instant quotes, manage bulk orders, and track deliveries—all in one place.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="btn-gold"
              >
                Access Portal
              </Link>
              <a
                href="mailto:partnerships@residentciment.com"
                className="btn-ghost"
              >
                Request Access
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-[#292524]/30"
      >
        <div className="max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "500+", label: "Enterprise Partners" },
              { value: "2M+", label: "Bags Delivered Annually" },
              { value: "99.2%", label: "Fulfillment Rate" },
              { value: "24h", label: "Avg. Lead Time" },
            ].map((stat, index) => (
              <div key={index} className="text-center"
              >
                <p className="text-4xl md:text-5xl font-headline font-bold text-[#e5c374] mb-2"
                >{stat.value}</p>
                <p className="text-[10px] text-[#57534e] uppercase tracking-widest"
                >{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6"
      >
        <div className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16"
          >
            <p className="text-[#e5c374] text-[10px] font-bold uppercase tracking-[0.3em] mb-4"
            >Why Choose Us</p>
            <h2 className="font-headline text-4xl font-bold text-[#e9e1dd] mb-4"
            >Built for Enterprise</h2>
            <p className="text-[#57534e] max-w-2xl mx-auto"
            >
              Our B2B portal provides the tools and insights you need to manage your cement procurement efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6"
          >
            {[
              {
                title: "Bulk Ordering",
                description: "Place large quantity orders with preferential B2B pricing and flexible delivery scheduling.",
              },
              {
                title: "Credit Terms",
                description: "Access competitive credit facilities with customized payment terms for your business.",
              },
              {
                title: "Real-time Tracking",
                description: "Monitor your shipments in real-time from factory to delivery point.",
              },
              {
                title: "Dedicated Support",
                description: "Get priority access to our enterprise sales team and technical support.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-[#1c1917] border border-[#292524]/30 hover:border-[#e5c374]/20 transition-colors group"
              >
                <h3 className="text-xl font-headline font-bold text-[#e9e1dd] mb-2 group-hover:text-[#e5c374] transition-colors"
                >{feature.title}</h3>
                <p className="text-[#57534e]"
                >{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6"
      >
        <div className="max-w-4xl mx-auto text-center"
        >
          <div className="p-12 bg-gradient-to-br from-[#221f1d] to-[#1c1917] border border-[#292524]/30"
          >
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-[#e9e1dd] mb-4"
            >
              Ready to Transform Your Procurement?
            </h2>
            <p className="text-[#57534e] mb-8 max-w-xl mx-auto"
            >
              Join hundreds of construction companies already using our B2B portal
              to streamline their cement sourcing.
            </p>
            <a
              href="mailto:partnerships@residentciment.com"
              className="btn-gold"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#292524]/30"
      >
        <div className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2"
            >
              <span className="font-headline text-lg text-[#e9e1dd] tracking-tight"
              >
                Resident<span className="text-[#e5c374]">Ciment</span>
              </span>
            </div>

            <p className="text-sm text-[#57534e]"
            >
              © {new Date().getFullYear()} Resident Ciment Bauchi Ltd. All rights reserved.
            </p>

            <div className="flex items-center gap-6"
            >
              <a
                href="https://residentcement.nyamabo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#57534e] hover:text-[#e5c374]"
              >Main Website</a>
              <a href="#" className="text-sm text-[#57534e] hover:text-[#e9e1dd]"
            >Privacy</a>
              <a href="#" className="text-sm text-[#57534e] hover:text-[#e9e1dd]"
            >Terms</a>
              <a href="#" className="text-sm text-[#57534e] hover:text-[#e9e1dd]"
            >Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
