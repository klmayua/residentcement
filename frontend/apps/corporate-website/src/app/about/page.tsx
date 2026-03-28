import Image from "next/image";
import Link from "next/link";

const milestones = [
  { year: "2023", title: "Company Founded", description: "Resident Ciment Bauchi Ltd registered under Corporate Affairs Commission of Nigeria" },
  { year: "2024", title: "Mining Licenses", description: "Secured mining licenses and commenced geological surveys across Nigeria" },
  { year: "2024", title: "Sinoma Partnership", description: "Landmark EPC agreement with Sinoma International Engineering for technology transfer" },
  { year: "2025", title: "Plant Construction", description: "Groundbreaking of greenfield cement plant in Gwana District, Bauchi State" },
  { year: "2026", title: "Production Launch", description: "Commercial production begins with 10 million metric tonnes annual capacity" },
];

const values = [
  { icon: "verified", title: "Integrity", description: "Transparent governance and ethical business practices across all operations." },
  { icon: "psychology", title: "Innovation", description: "Investing in world-class technology and sustainable manufacturing processes." },
  { icon: "diversity_3", title: "Empowerment", description: "Creating jobs and empowering local communities through sustainable development." },
  { icon: "eco", title: "Sustainability", description: "Minimising environmental impact while maximising industrial output." },
];

export default function AboutPage() {
  return (
    <main className="bg-stone-950 text-white">
      {/*  Hero  */}
      <section className="relative min-h-[300px] flex items-end pt-16">
        <Image
          src="/images/real/home-background-hero.webp"
          alt="Resident Ciment Plant at Gwana"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
            Our Story
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
            About Resident Ciment
          </h1>
          <p className="text-stone-400 text-base max-w-xl leading-relaxed">
            Building Nigeria&apos;s industrial future with world-class cement manufacturing.
          </p>
        </div>
      </section>

      {/*  Mission, Vision & Stats  split 3-col  */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left  Mission */}
          <div className="lg:col-span-4 border-t border-secondary/40 pt-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Our Mission
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Building Nigeria&apos;s Future
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed mb-4">
              We are committed to providing high-quality cement products that meet international
              standards while promoting sustainable development and empowering local communities.
            </p>
            <p className="text-stone-500 text-sm leading-relaxed">
              Our state-of-the-art facility in Bauchi State creates thousands of jobs and drives
              economic growth across the region.
            </p>
          </div>

          {/* Centre  Image */}
          <div className="lg:col-span-4 relative min-h-[280px] overflow-hidden">
            <Image
              src="/images/real/about-cement-facility-1.webp"
              alt="Cement plant facility"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
            {/* Stats overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 flex gap-6">
              <div>
                <div className="text-2xl font-black text-secondary">10M</div>
                <div className="text-[10px] text-stone-400 uppercase tracking-[0.15em]">Tonnes / Year</div>
              </div>
              <div>
                <div className="text-2xl font-black text-secondary">42.5R</div>
                <div className="text-[10px] text-stone-400 uppercase tracking-[0.15em]">Strength Class</div>
              </div>
              <div>
                <div className="text-2xl font-black text-secondary">EN197</div>
                <div className="text-[10px] text-stone-400 uppercase tracking-[0.15em]">Certified</div>
              </div>
            </div>
          </div>

          {/* Right  Vision */}
          <div className="lg:col-span-4 border-t border-secondary/40 pt-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Our Vision
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Industrial Excellence
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed mb-4">
              To become West Africa&apos;s premier cement manufacturer, recognised for quality,
              innovation, and environmental stewardship.
            </p>
            <p className="text-stone-500 text-sm leading-relaxed">
              We envision a future where Nigerian infrastructure is built on locally-produced,
              world-class cement products that rival any in the global market.
            </p>
          </div>

        </div>
      </section>

      {/*  Core Values  */}
      <section className="py-16 px-6 lg:px-10 bg-stone-900/40">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-2 block">
                What Drives Us
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                Core Values
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {values.map((value) => (
              <div key={value.title} className="bg-stone-950 p-7 group hover:bg-stone-900/50 transition-colors">
                <span className="material-symbols-outlined text-3xl text-secondary/60 group-hover:text-secondary transition-colors mb-5 block">
                  {value.icon}
                </span>
                <h3 className="font-serif text-lg font-semibold mb-2 tracking-tight">{value.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  Milestones  */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-2 block">
              Our Journey
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
              Key Milestones
            </h2>
          </div>
          {/* Timeline */}
          <div className="relative">
            <div className="hidden md:block absolute top-5 left-0 right-0 h-[2px] bg-white/5" />
            <div className="hidden md:block absolute top-5 left-0 h-[2px] bg-secondary/40 w-[85%]" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-white/5">
              {milestones.map((milestone) => (
                <div key={milestone.year + milestone.title} className="bg-stone-950 p-7 relative">
                  <div className="hidden md:block absolute top-4 left-0 w-3 h-3 rounded-full bg-secondary -translate-x-1/2 -translate-y-1/2 ring-2 ring-stone-950" />
                  <div className="gold-gradient-text text-2xl font-serif font-bold mb-2">
                    {milestone.year}
                  </div>
                  <h3 className="font-semibold mb-2 text-white text-sm">{milestone.title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*  Facility Gallery  split  */}
      <section className="py-16 px-6 lg:px-10 bg-stone-900/40">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          {/* Left  image */}
          <div className="relative h-[360px] lg:h-auto min-h-[320px]">
            <Image
              src="/images/real/about-cement-facility-1.webp"
              alt="Gwana Manufacturing Plant"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="font-serif text-xl font-semibold mb-1">Gwana Manufacturing Plant</h3>
              <p className="text-stone-400 text-sm">10 million metric tonnes annual capacity</p>
            </div>
          </div>
          {/* Right  image + text */}
          <div className="flex flex-col">
            <div className="relative h-[220px]">
              <Image
                src="/images/real/gallery-site-visit-2.webp"
                alt="Sinoma Partnership Signing"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-serif text-lg font-semibold mb-1">Sinoma EPC Partnership</h3>
                <p className="text-stone-400 text-xs">World-class technology transfer agreement</p>
              </div>
            </div>
            <div className="bg-stone-900 flex-1 p-8 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
                World-Class Infrastructure
              </span>
              <p className="text-stone-400 text-sm leading-relaxed mb-4">
                Our greenfield plant in Gwana, Bauchi State is engineered by Sinoma, the global
                leader in cement plant construction, delivering international standards at scale.
              </p>
              <Link
                href="/team/"
                className="text-secondary font-bold uppercase text-[11px] tracking-[0.2em] inline-flex items-center gap-2 group"
              >
                Meet Our Team
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*  CTA  */}
      <section className="gold-gradient py-14 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-1">
              Meet Our Leadership
            </h2>
            <p className="text-white/70 text-sm">
              Discover the team driving Resident Ciment&apos;s vision of industrial excellence.
            </p>
          </div>
          <Link
            href="/team/"
            className="px-8 py-3.5 bg-white text-stone-950 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            Our Team
          </Link>
        </div>
      </section>
    </main>
  );
}


