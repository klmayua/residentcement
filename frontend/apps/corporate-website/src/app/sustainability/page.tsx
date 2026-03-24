import Image from "next/image";
import Link from "next/link";
import { Download, BarChart3, Droplets, Shield, FileText } from "lucide-react";

export default function SustainabilityPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[921px] flex items-end px-6 sm:px-8 lg:px-12 xl:px-16 pb-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=2070&auto=format&fit=crop"
            alt="Industrial cement facility at dawn"
            fill
            className="object-cover grayscale brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl">
          <h1 className="text-white text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter mb-8">
            Architects of a Sustainable Legacy.
          </h1>
          <p className="text-white/70 text-xl md:text-2xl max-w-2xl font-body leading-relaxed">
            Balancing $1.5B industrial growth with unwavering environmental and social stewardship.
          </p>
        </div>
      </section>

      {/* ESG Impact Monoliths */}
      <section className="bg-primary text-white py-24 lg:py-32 px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="container-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Stat 1 */}
            <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/20">
              <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] block mb-6">
                Carbon Footprint
              </span>
              <h2 className="text-5xl font-black tracking-tighter mb-4">-22%</h2>
              <p className="text-white/50 text-sm uppercase tracking-widest">
                CO2 Reduction targets
              </p>
            </div>
            {/* Stat 2 */}
            <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/20">
              <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] block mb-6">
                Alternative Fuel (AFR)
              </span>
              <h2 className="text-5xl font-black tracking-tighter mb-4">35%</h2>
              <p className="text-white/50 text-sm uppercase tracking-widest">
                Thermal Substitution
              </p>
            </div>
            {/* Stat 3 */}
            <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/20">
              <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] block mb-6">
                Social ROI
              </span>
              <h2 className="text-5xl font-black tracking-tighter mb-4">$12M</h2>
              <p className="text-white/50 text-sm uppercase tracking-widest">
                Community Investment
              </p>
            </div>
            {/* Stat 4 */}
            <div className="p-8 lg:p-12">
              <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] block mb-6">
                Governance
              </span>
              <h2 className="text-5xl font-black tracking-tighter mb-4">100%</h2>
              <p className="text-white/50 text-sm uppercase tracking-widest">
                Transparency Compliance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Stewardship Grid */}
      <section className="bg-surface section-padding">
        <div className="container-full">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 lg:mb-24 border-b-2 border-primary pb-8">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter">
              Stewardship
            </h2>
            <p className="text-secondary font-headline text-2xl italic mt-4 md:mt-0">
              The Earth is our Foundation.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Biodiversity - Large Card */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-8 lg:p-16 flex flex-col justify-between min-h-[500px]">
              <div>
                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-8 block">
                  Initiative 01
                </span>
                <h3 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Biodiversity Protection
                </h3>
                <p className="text-on-surface/60 text-lg max-w-md leading-relaxed">
                  Active restoration of limestone quarries into thriving local ecosystems, reintroducing indigenous flora and fauna through curated reforestation programs.
                </p>
              </div>
              <div className="mt-8">
                <Image
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
                  alt="Reforestation area in reclaimed quarry"
                  width={600}
                  height={256}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Water Stewardship - Tall Card */}
            <div className="lg:col-span-5 bg-primary text-white p-8 lg:p-12 flex flex-col justify-center">
              <Droplets className="w-16 h-16 text-secondary mb-8" strokeWidth={1.5} />
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                Water Stewardship
              </h3>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Our zero-liquid discharge facilities ensure that 100% of industrial water is recycled and treated within our closed-loop system.
              </p>
              <div className="h-1 bg-secondary w-24" />
            </div>

            {/* Net-Zero Roadmap - Full Width */}
            <div className="lg:col-span-12 bg-surface-container-highest p-8 lg:p-20">
              <div className="max-w-5xl mx-auto">
                <h3 className="text-4xl lg:text-5xl font-bold mb-12 lg:mb-16">
                  Net-Zero Roadmap
                </h3>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute top-1/2 left-0 w-full h-px bg-outline-variant hidden lg:block" />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                    {/* 2025 */}
                    <div className="bg-surface-container-lowest p-6 lg:p-8 border-l-4 border-secondary">
                      <span className="text-2xl font-bold block mb-2">2025</span>
                      <p className="text-xs uppercase tracking-widest text-on-surface/60">
                        Carbon Capture Pilot
                      </p>
                    </div>
                    {/* 2030 */}
                    <div className="bg-surface-container-lowest p-6 lg:p-8 border-l-4 border-primary">
                      <span className="text-2xl font-bold block mb-2">2030</span>
                      <p className="text-xs uppercase tracking-widest text-on-surface/60">
                        50% Thermal Energy from Waste
                      </p>
                    </div>
                    {/* 2040 */}
                    <div className="bg-surface-container-lowest p-6 lg:p-8 border-l-4 border-primary">
                      <span className="text-2xl font-bold block mb-2">2040</span>
                      <p className="text-xs uppercase tracking-widest text-on-surface/60">
                        Hydrogen Powered Logistics
                      </p>
                    </div>
                    {/* 2050 */}
                    <div className="bg-secondary text-white p-6 lg:p-8">
                      <span className="text-2xl font-bold block mb-2">2050</span>
                      <p className="text-xs uppercase tracking-widest">
                        Net-Zero Neutrality
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Titan Foundation - Social Impact */}
      <section className="bg-surface-container-lowest py-24 lg:py-32">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1581056771107-24ca4f373bb2?q=80&w=1000&auto=format&fit=crop"
                alt="Modern healthcare clinic in rural setting"
                width={800}
                height={800}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <span className="text-secondary text-sm font-bold uppercase tracking-widest block mb-6">
                Social Impact
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                The Titan Foundation
              </h2>
              <p className="text-2xl font-headline italic text-on-surface/60 mb-12">
                Empowering Alkaleri LGA through structural transformation.
              </p>

              <div className="space-y-10">
                <div className="flex gap-6">
                  <span className="text-4xl font-black text-secondary">01</span>
                  <div>
                    <h4 className="text-xl font-bold uppercase tracking-tight mb-2">
                      Education & Health
                    </h4>
                    <p className="text-on-surface/60">
                      Commissioned 12 high-capacity schools and 4 specialized healthcare clinics for the local workforce and their families.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <span className="text-4xl font-black text-secondary">02</span>
                  <div>
                    <h4 className="text-xl font-bold uppercase tracking-tight mb-2">
                      3,000+ Career Paths
                    </h4>
                    <p className="text-on-surface/60">
                      Beyond the plant, our logistics network sustains a vast ecosystem of local entrepreneurs and specialized technicians.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics as Foundation - Governance */}
      <section className="bg-surface-container-low py-24 lg:py-32 px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="container-wide">
          <div className="border-t-8 border-primary pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
              {/* Column 1 */}
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  Ethics as Foundation
                </h2>
                <p className="text-on-surface/60 text-lg">
                  Our governance framework is the iron rod within our structure, ensuring integrity at every level of the Monolith.
                </p>
              </div>

              {/* Column 2 */}
              <div className="space-y-10">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Anti-Corruption
                  </h4>
                  <p className="text-sm leading-relaxed text-on-surface/70">
                    Rigorous internal audits and third-party transparency checks are mandatory for all $1M+ procurement cycles.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    GRI Standard
                  </h4>
                  <p className="text-sm leading-relaxed text-on-surface/70">
                    Commitment to Global Reporting Initiative (GRI) standards for all environmental and social disclosure.
                  </p>
                </div>
              </div>

              {/* Column 3 - Hotline Card */}
              <div className="bg-primary text-white p-10 lg:p-12 flex flex-col justify-between">
                <div>
                  <h4 className="text-secondary text-xs font-bold uppercase tracking-widest mb-4">
                    Whistleblower Hotline
                  </h4>
                  <p className="text-2xl lg:text-3xl font-bold mb-6">
                    0800-RESIDENT-SAFE
                  </p>
                </div>
                <p className="text-xs text-white/50">
                  Secure, anonymous reporting for all ethics violations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Center CTA */}
      <section className="py-32 lg:py-40 px-6 sm:px-8 lg:px-12 xl:px-16 text-center bg-surface relative overflow-hidden">
        {/* Background Text */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <span className="text-[15vw] font-black text-surface-container opacity-20 select-none leading-none">
            REPORTS
          </span>
        </div>

        <div className="relative z-10 container-narrow">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-12 tracking-tighter">
            Transparency Center
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="btn-secondary inline-flex items-center justify-center gap-3">
              <Download className="w-5 h-5" />
              2024 Sustainability Report (PDF)
            </button>
            <button className="btn-outline inline-flex items-center justify-center gap-3 border-primary text-primary hover:bg-primary hover:text-white">
              <BarChart3 className="w-5 h-5" />
              Interactive Data Tool
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
