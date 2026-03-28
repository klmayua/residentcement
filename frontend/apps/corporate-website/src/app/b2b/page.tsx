import Image from "next/image";
import Link from "next/link";

const solutions = [
  {
    icon: "inventory_2",
    title: "Bulk Ordering",
    description:
      "Direct factory-to-site bulk cement supply with guaranteed volume allocations and priority scheduling for large-scale projects.",
  },
  {
    icon: "local_shipping",
    title: "Fleet Logistics",
    description:
      "Dedicated fleet management with real-time tracking, optimised routing, and guaranteed delivery windows across Nigeria.",
  },
  {
    icon: "account_balance",
    title: "Account Management",
    description:
      "Dedicated account managers for enterprise clients with customised pricing structures, volume commitments, and SLA guarantees.",
  },
  {
    icon: "receipt_long",
    title: "Invoicing & Credit",
    description:
      "Flexible payment terms, automated invoicing, and credit facilities for qualified corporate partners and government contractors.",
  },
  {
    icon: "engineering",
    title: "Technical Support",
    description:
      "On-site technical assistance, product specification guidance, and quality assurance consultation for complex construction projects.",
  },
  {
    icon: "handshake",
    title: "Partnership Programs",
    description:
      "Strategic partnership tiers with escalating benefits, priority access to new products, and joint marketing opportunities.",
  },
];

const industries = [
  {
    icon: "apartment",
    title: "Real Estate Development",
    description: "High-rise residential and commercial construction projects requiring consistent, high-volume cement supply.",
  },
  {
    icon: "road",
    title: "Infrastructure & Roads",
    description: "Federal and state highway projects, bridges, and public infrastructure development across Nigeria.",
  },
  {
    icon: "factory",
    title: "Industrial Construction",
    description: "Manufacturing facilities, warehouses, and industrial complexes requiring specialised cement grades.",
  },
  {
    icon: "account_balance",
    title: "Government Projects",
    description: "Public sector construction including schools, hospitals, government offices, and municipal infrastructure.",
  },
];

export default function B2BPage() {
  return (
    <main className="bg-stone-950 text-white">
      {/* Hero */}
      <section className="relative min-h-[340px] flex items-end pt-16">
        <Image
          src="/images/real/home-concrete-plant.webp"
          alt="Resident Ciment Bauchi Ltd Operations"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
            Enterprise Solutions
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
            B2B Supply
          </h1>
          <p className="text-stone-400 text-lg max-w-xl leading-relaxed mb-6">
            Industrial-scale cement solutions for construction companies, government contractors, and enterprise buyers across Nigeria.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/media/"
              className="px-7 py-3 bg-secondary text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-secondary/90 transition-colors"
            >
              Contact Sales
            </Link>
            <a
              href="https://rcb2bportal.nyamabo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              B2B Portal
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 py-12 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["10M+", "Annual Capacity (MT)"],
            ["42.5R", "Grade Strength"],
            ["36", "States Covered"],
            ["EN 197", "Certified Standard"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="gold-gradient-text text-3xl md:text-4xl font-serif font-bold mb-1">
                {value}
              </div>
              <div className="text-stone-500 text-[11px] uppercase tracking-[0.2em]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-14 md:py-24 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              What We Offer
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Enterprise Solutions
            </h2>
            <p className="text-stone-500 max-w-2xl leading-relaxed">
              End-to-end supply chain solutions designed for businesses that need reliable, high-volume cement delivery with predictable pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {solutions.map((item) => (
              <div
                key={item.title}
                className="glass-card-gold p-10 group"
              >
                <span className="material-symbols-outlined text-3xl text-secondary/60 group-hover:text-secondary transition-colors mb-6 block">
                  {item.icon}
                </span>
                <h3 className="font-serif text-xl font-semibold mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-14 md:py-24 px-6 lg:px-10 bg-stone-900/40">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Industries We Serve
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Built for Every Sector
            </h2>
            <p className="text-stone-500 max-w-2xl leading-relaxed">
              From high-rise developments to federal highways, our cement meets the demands of Nigeria&apos;s most ambitious construction projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {industries.map((item) => (
              <div
                key={item.title}
                className="bg-stone-950 p-10 group hover:bg-stone-900/50 transition-colors"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-white/5 group-hover:bg-secondary/10 transition-colors">
                    <span className="material-symbols-outlined text-2xl text-stone-600 group-hover:text-secondary transition-colors">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-14 md:py-24 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              How It Works
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Getting Started
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Contact Sales", desc: "Reach out to our B2B team with your project requirements and volume estimates." },
              { step: "02", title: "Consultation", desc: "Our account managers assess your needs and propose a tailored supply agreement." },
              { step: "03", title: "Agreement", desc: "Finalise pricing, delivery schedules, payment terms, and quality specifications." },
              { step: "04", title: "Delivery", desc: "Receive consistent, on-time cement deliveries with dedicated logistics support." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="gold-gradient-text text-5xl font-serif font-bold mb-4 opacity-40">
                  {item.step}
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gold-gradient py-20 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
              Ready to Scale Your Supply?
            </h2>
            <p className="text-white/70">
              Contact our B2B team for volume pricing and custom supply agreements.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/media/"
              className="px-8 py-3.5 bg-white text-stone-950 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-colors"
            >
              Contact Sales
            </Link>
            <a
              href="https://rcb2bportal.nyamabo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border border-white/30 text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-colors"
            >
              B2B Portal
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

