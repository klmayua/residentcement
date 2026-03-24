import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Factory,
  HardHat,
  Settings,
  Quote,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* News Ticker */}
      <div className="bg-primary text-white py-2 overflow-hidden whitespace-nowrap border-b border-white/10">
        <div className="animate-marquee inline-block">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mr-12">
            <span className="text-secondary mr-2">●</span> Q3 Production Up 14%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mr-12">
            <span className="text-secondary mr-2">●</span> New Sustainability Framework Launched
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mr-12">
            <span className="text-secondary mr-2">●</span> Obajana Plant Upgrade Complete
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mr-12">
            <span className="text-secondary mr-2">●</span> NSE: RESCEMENT +2.4%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mr-12">
            <span className="text-secondary mr-2">●</span> Architectural Integrity Since 1984
          </span>
          {/* Duplicate for seamless loop */}
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mr-12">
            <span className="text-secondary mr-2">●</span> Q3 Production Up 14%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mr-12">
            <span className="text-secondary mr-2">●</span> New Sustainability Framework Launched
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mr-12">
            <span className="text-secondary mr-2">●</span> Obajana Plant Upgrade Complete
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mr-12">
            <span className="text-secondary mr-2">●</span> NSE: RESCEMENT +2.4%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mr-12">
            <span className="text-secondary mr-2">●</span> Architectural Integrity Since 1984
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[921px] flex items-center overflow-hidden bg-primary">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-60">
          <Image
            src="https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=2070&auto=format&fit=crop"
            alt="Massive industrial cement manufacturing plant at twilight"
            fill
            className="object-cover grayscale contrast-125"
            priority
          />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 hero-gradient" />

        {/* Content */}
        <div className="relative z-20 container-full px-6 sm:px-8 lg:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-24 pt-32">
          <div className="lg:col-span-7">
            <h1 className="text-white text-display-lg mb-8">
              Building <br /> Nigeria&apos;s <br /> <span className="text-secondary">Industrial Future</span>
            </h1>
            <p className="text-white/70 max-w-xl font-body text-lg leading-relaxed mb-10">
              A commitment to structural permanence and economic resilience. We are curating the foundations of a continent, one monolithic achievement at a time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/operations" className="btn-secondary inline-flex items-center gap-2">
                Explore Operations
              </Link>
              <Link href="/report" className="btn-outline inline-flex items-center gap-2">
                Download Report
              </Link>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="lg:col-span-5 bg-white p-10 space-y-8">
            <div>
              <span className="label-micro block mb-2">Capital Injection</span>
              <div className="text-4xl md:text-5xl font-black font-headline text-primary">$1.5B Investment</div>
              <div className="w-full bg-surface-container h-1 mt-4">
                <div className="bg-secondary h-full w-[85%]" />
              </div>
            </div>
            <div>
              <span className="label-micro block mb-2">Annual Output</span>
              <div className="text-4xl md:text-5xl font-black font-headline text-primary">10M Tonnes</div>
              <p className="text-xs text-on-surface/50 mt-2">Combined Capacity Across Regional Hubs</p>
            </div>
            <div className="pt-4 border-t border-outline-variant/15">
              <Link href="/strategy" className="text-secondary font-bold uppercase text-xs tracking-widest inline-flex items-center gap-2 hover:gap-4 transition-all duration-300">
                View Strategic Plan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Quick Links - Slab Layout */}
      <section className="bg-surface-container-low section-padding">
        <div className="container-wide">
          <div className="mb-16">
            <span className="label-section">Direct Portals</span>
            <h2 className="text-display-md mt-4 text-primary">Stakeholder Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {/* Card 1 */}
            <div className="bg-surface-container-highest p-12 group hover:bg-primary transition-all duration-500 cursor-pointer">
              <Building2 className="w-10 h-10 text-secondary mb-8 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-500">Institutional Investors</h3>
              <p className="text-on-surface/60 group-hover:text-white/70 mb-8 font-body transition-colors duration-500">
                Access quarterly earnings, ESG disclosures, and governance documentation.
              </p>
              <div className="h-[2px] w-12 bg-secondary group-hover:w-full transition-all duration-500" />
            </div>
            {/* Card 2 */}
            <div className="bg-surface-container-highest p-12 group hover:bg-primary transition-all duration-500 cursor-pointer">
              <Factory className="w-10 h-10 text-secondary mb-8 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-500">Distributors & Retail</h3>
              <p className="text-on-surface/60 group-hover:text-white/70 mb-8 font-body transition-colors duration-500">
                Manage bulk orders, track logistics, and access technical product data sheets.
              </p>
              <div className="h-[2px] w-12 bg-secondary group-hover:w-full transition-all duration-500" />
            </div>
            {/* Card 3 */}
            <div className="bg-surface-container-highest p-12 group hover:bg-primary transition-all duration-500 cursor-pointer">
              <HardHat className="w-10 h-10 text-secondary mb-8 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-500">Engineering Partners</h3>
              <p className="text-on-surface/60 group-hover:text-white/70 mb-8 font-body transition-colors duration-500">
                Structural specifications and material safety certifications for large-scale projects.
              </p>
              <div className="h-[2px] w-12 bg-secondary group-hover:w-full transition-all duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Live Project Timeline - Bento Style */}
      <section className="section-padding bg-surface">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Text */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <span className="label-section mb-6 block">Project Momentum</span>
              <h2 className="text-display-md text-primary mb-8">Timeline of Architectural Progress</h2>
              <p className="text-on-surface/70 font-body mb-8">
                Tracking our physical expansion and industrial milestones as they materialize across the landscape.
              </p>
              <Link href="/projects" className="btn-primary self-start">
                Full Project Map
              </Link>
            </div>

            {/* Right Column - Bento Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 - Kogi Expansion */}
              <div className="bg-surface-container h-[300px] p-8 flex flex-col justify-between relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="bg-secondary text-white text-[10px] px-3 py-1.5 font-bold uppercase tracking-wider">Phase 04 : Live</span>
                  <h4 className="text-2xl font-bold mt-4 font-headline">Kogi Expansion</h4>
                </div>
                <div className="relative z-10">
                  <p className="text-sm text-on-surface/60">Installation of next-gen vertical roller mills</p>
                  <span className="text-xs font-bold text-primary mt-2 block">Completion: Q4 2024</span>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <Settings className="w-32 h-32" strokeWidth={1} />
                </div>
              </div>

              {/* Card 2 - Solar Integration */}
              <div className="bg-primary text-white h-[300px] p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <span className="bg-white/20 text-white text-[10px] px-3 py-1.5 font-bold uppercase tracking-wider">Success</span>
                  <h4 className="text-2xl font-bold mt-4 font-headline">Solar Integration</h4>
                </div>
                <p className="text-white/60 text-sm relative z-10">
                  Now powering 30% of administrative operations through onsite renewables.
                </p>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
                  <Image
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000&auto=format&fit=crop"
                    alt="Solar panels"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Card 3 - Full Width Stats */}
              <div className="md:col-span-2 bg-surface-container-low p-8 flex flex-col md:flex-row gap-8 items-center border-l-4 border-secondary">
                <div className="flex-shrink-0 text-center px-6">
                  <div className="text-5xl md:text-6xl font-black text-secondary">24/7</div>
                  <div className="label-micro mt-1">Operation Status</div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-xl mb-1">Industrial Uptime Excellence</h4>
                  <p className="text-sm text-on-surface/60">
                    Maintaining rigorous safety standards across all 12 manufacturing nodes simultaneously.
                  </p>
                </div>
                <Link href="/safety" className="btn-tertiary whitespace-nowrap">
                  Safety Metrics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News and Narrative Section */}
      <section className="bg-surface-container-highest section-padding">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* News Column */}
            <div className="space-y-12">
              <div className="border-b border-outline-variant/30 pb-12">
                <span className="label-micro block mb-4">12 Oct 2024 / Industry</span>
                <h3 className="text-3xl font-bold font-headline mb-6 hover:text-secondary cursor-pointer transition-colors">
                  Strengthening the Supply Chain: New Terminal at Apapa Port
                </h3>
                <p className="text-on-surface/60 line-clamp-2">
                  The logistical expansion marks a pivotal turn in our ability to serve the coastal regions with unprecedented speed and efficiency...
                </p>
              </div>
              <div className="border-b border-outline-variant/30 pb-12">
                <span className="label-micro block mb-4">04 Oct 2024 / ESG</span>
                <h3 className="text-3xl font-bold font-headline mb-6 hover:text-secondary cursor-pointer transition-colors">
                  Decarbonization Roadmap: The Path to Net Zero Cement
                </h3>
                <p className="text-on-surface/60 line-clamp-2">
                  Our engineers have successfully piloted a low-clinker formulation that reduces carbon intensity by 22% while maintaining PSI strength ratings...
                </p>
              </div>
              <div>
                <span className="label-micro block mb-4">28 Sep 2024 / Operations</span>
                <h3 className="text-3xl font-bold font-headline mb-6 hover:text-secondary cursor-pointer transition-colors">
                  Bauchi Plant Reaches 95% Operational Capacity
                </h3>
                <p className="text-on-surface/60 line-clamp-2">
                  The flagship facility has exceeded production targets for the third consecutive quarter, solidifying its position as a regional hub...
                </p>
              </div>
            </div>

            {/* Manifesto Card */}
            <div className="bg-primary text-white p-12 lg:p-16 flex flex-col justify-between min-h-[600px]">
              <div>
                <h3 className="text-5xl md:text-6xl font-black font-headline mb-8 leading-none">
                  The <br />Architectural <br />Manifesto
                </h3>
                <p className="text-white/60 text-lg font-body leading-relaxed">
                  &quot;Cement is the invisible skeleton of the modern world. At Resident Cement, we treat this responsibility as a curation of permanence. Every tonne produced is a promise of stability for the next generation of builders.&quot;
                </p>
              </div>
              <div className="pt-12 mt-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                    <Quote className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold uppercase text-xs tracking-widest">Office of the CEO</p>
                    <p className="label-micro text-white/50">Strategic Leadership Division</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-24 px-6 sm:px-8 lg:px-12">
        <div className="container-narrow text-center">
          <h2 className="text-display-md text-white mb-6">Join the Industrial Future</h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Whether you&apos;re an investor, distributor, or engineering partner, discover how Resident Cement is building Nigeria&apos;s infrastructure for generations to come.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-secondary">
              Get in Touch
            </Link>
            <Link href="/investors" className="btn-outline">
              Investor Relations
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
