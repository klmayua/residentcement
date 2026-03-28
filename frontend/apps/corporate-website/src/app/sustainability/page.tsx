import Image from "next/image";
import Link from "next/link";

export default function SustainabilityPage() {
  return (
    <main className="bg-stone-950 text-white">
      {/* Hero */}
      <section className="relative min-h-[360px] flex items-end pt-16">
        <Image
          src="/images/real/about-cement-facility-1.webp"
          alt="Resident Ciment Plant"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
            ESG Commitment
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            Sustainability
          </h1>
          <p className="text-stone-400 text-lg max-w-xl leading-relaxed">
            Balancing industrial growth with environmental stewardship and community empowerment.
          </p>
        </div>
      </section>

      {/* ESG Stats */}
      <section className="border-y border-white/5 py-12 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["-22%", "CO\u2082 Reduction Target"],
            ["35%", "Alternative Fuel Rate"],
            ["100%", "Water Recycled"],
            ["3,000+", "Jobs Created"],
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

      {/* Environmental Stewardship */}
      <section className="py-14 md:py-24 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Environmental
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Stewardship
            </h2>
            <p className="text-stone-500 max-w-2xl leading-relaxed">
              Our environmental strategy centres on reducing emissions, conserving water, and restoring biodiversity around our operational areas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 glass-card-gold p-10 min-h-[380px] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary/60 mb-4 block">Initiative 01</span>
                <h3 className="font-serif text-3xl font-bold tracking-tight mb-4">Biodiversity Protection</h3>
                <p className="text-stone-400 leading-relaxed max-w-md">
                  Active restoration of limestone quarries into thriving ecosystems. Reintroduction of indigenous flora and fauna through curated reforestation programmes around Gwana District.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 bg-stone-900 border border-white/5 p-10 min-h-[380px] flex flex-col justify-center">
              <span className="material-symbols-outlined text-4xl text-secondary/60 mb-6">water_drop</span>
              <h3 className="font-serif text-2xl font-bold tracking-tight mb-4">Water Stewardship</h3>
              <p className="text-stone-400 leading-relaxed">
                Zero-liquid discharge facilities ensure 100% of industrial water is recycled within our closed-loop system, protecting local water sources in Alkaleri LGA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Net-Zero Roadmap */}
      <section className="py-14 md:py-24 px-6 lg:px-10 bg-stone-900/40">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Climate Action
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
              Net-Zero Roadmap
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/5">
            {[
              { year: "2025", milestone: "Carbon Capture Pilot", active: false },
              { year: "2030", milestone: "50% Thermal from Waste", active: false },
              { year: "2040", milestone: "Hydrogen Logistics Fleet", active: false },
              { year: "2050", milestone: "Net-Zero Neutrality", active: true },
            ].map((item) => (
              <div
                key={item.year}
                className={`p-8 ${item.active ? "gold-gradient" : "bg-stone-950"}`}
              >
                <div className={`text-3xl font-serif font-bold mb-3 ${item.active ? "text-white" : "gold-gradient-text"}`}>
                  {item.year}
                </div>
                <p className={`text-sm uppercase tracking-[0.15em] ${item.active ? "text-white/80" : "text-stone-500"}`}>
                  {item.milestone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="py-14 md:py-24 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Social Impact
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Community Development
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed italic font-serif mb-8">
              Empowering Alkaleri LGA through structural transformation
            </p>
            <div className="space-y-8">
              {[
                { num: "01", title: "Education & Health", desc: "Schools and healthcare clinics commissioned for the local workforce and their families in Gwana District." },
                { num: "02", title: "3,000+ Career Paths", desc: "Beyond the plant, our logistics network sustains a vast ecosystem of local entrepreneurs and specialised technicians." },
                { num: "03", title: "Infrastructure", desc: "Road construction and utility upgrades benefiting communities across Alkaleri Local Government Area." },
              ].map((item) => (
                <div key={item.num} className="flex gap-6">
                  <span className="gold-gradient-text text-3xl font-serif font-bold flex-shrink-0">{item.num}</span>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[500px]">
            <Image
              src="/images/real/home-cement-workers.webp"
              alt="Community development"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="py-14 md:py-24 px-6 lg:px-10 bg-stone-900/40">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Governance
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
              Ethics as Foundation
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            <div className="bg-stone-950 p-10">
              <span className="material-symbols-outlined text-2xl text-secondary/60 mb-6 block">shield</span>
              <h3 className="font-serif text-xl font-semibold mb-3">Anti-Corruption</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Rigorous internal audits and third-party transparency checks for all major procurement cycles.
              </p>
            </div>
            <div className="bg-stone-950 p-10">
              <span className="material-symbols-outlined text-2xl text-secondary/60 mb-6 block">description</span>
              <h3 className="font-serif text-xl font-semibold mb-3">GRI Standard</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Commitment to Global Reporting Initiative standards for all environmental and social disclosure.
              </p>
            </div>
            <div className="bg-stone-950 p-10">
              <span className="material-symbols-outlined text-2xl text-secondary/60 mb-6 block">gavel</span>
              <h3 className="font-serif text-xl font-semibold mb-3">Regulatory Compliance</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Full compliance with Nigerian mining, environmental, and corporate governance regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gold-gradient py-20 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
              Learn More About Our Impact
            </h2>
            <p className="text-white/70">
              Contact us for our sustainability report and ESG disclosures.
            </p>
          </div>
          <Link
            href="/media/"
            className="px-8 py-3.5 bg-white text-stone-950 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}

