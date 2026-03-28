import Image from "next/image";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="bg-stone-950 text-white">
      {/* Hero */}
      <section className="relative min-h-[340px] flex items-end pt-16 overflow-hidden">
        <Image
          src="/images/real/home-concrete-plant.webp"
          alt="Resident Cement Plant"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Product Range
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
              Our Products
            </h1>
            <p className="text-stone-400 text-lg max-w-xl leading-relaxed">
              EN 197 certified cement products engineered for Nigeria&apos;s most demanding construction projects.
            </p>
          </div>
          <div className="hidden lg:flex justify-end">
            <Image
              src="/images/real/products/cement-bag-nobg.webp"
              alt="Resident Cement 50kg Bag"
              width={320}
              height={420}
              className="h-[380px] w-auto object-contain drop-shadow-[0_0_40px_rgba(121,89,31,0.3)]"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 py-12 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["10M+", "Annual Capacity (MT)"],
            ["42.5R", "Grade Strength"],
            ["EN 197", "Certified Standard"],
            ["50kg", "Bag Weight"],
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

      {/* Product Portfolio */}
      <section className="py-14 md:py-24 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              The Collection
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
              Product Portfolio
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* PLC - Main */}
            <div className="lg:col-span-7 glass-card-gold p-10 flex flex-col justify-between min-h-[420px]">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-serif text-3xl font-bold italic tracking-tight">
                    Portland Limestone Cement
                  </h3>
                  <span className="text-[10px] px-3 py-1 border border-secondary/30 text-secondary uppercase font-bold tracking-wider">
                    Eco-Efficient
                  </span>
                </div>
                <p className="text-stone-400 max-w-md leading-relaxed">
                  Engineered for high early strength and reduced carbon footprint. Ideal for residential developments and general-purpose structural masonry. Compliant with EN 197-1 CEM II standards.
                </p>
              </div>
              <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-stone-600 uppercase tracking-[0.2em]">Strength</p>
                  <p className="font-semibold text-lg">42.5R</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-600 uppercase tracking-[0.2em]">Application</p>
                  <p className="font-semibold text-lg">Residential</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-600 uppercase tracking-[0.2em]">Standard</p>
                  <p className="font-semibold text-lg">EN 197</p>
                </div>
              </div>
            </div>

            {/* OPC */}
            <div className="lg:col-span-5 bg-stone-900 p-10 flex flex-col justify-between min-h-[420px] border border-white/5">
              <div>
                <h3 className="font-serif text-3xl font-bold italic tracking-tight mb-6">
                  Ordinary Portland Cement
                </h3>
                <p className="text-stone-400 leading-relaxed mb-8">
                  The structural foundation for heavy civil works. Grade 52.5N for massive infrastructure including bridges, dams, and power installations.
                </p>
              </div>
              <div className="pt-8 border-t border-white/5">
                <ul className="space-y-3">
                  {["Heavy Civil Works", "Marine Environments", "High-Rise Structural"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span className="w-2 h-2 bg-secondary flex-shrink-0" />
                      <span className="text-stone-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Masonry */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 bg-stone-900 border border-white/5 overflow-hidden">
              <div className="p-10 flex flex-col justify-center">
                <h3 className="font-serif text-3xl font-bold tracking-tight mb-4">
                  Masonry Cement
                </h3>
                <p className="text-stone-400 leading-relaxed mb-8">
                  Specialised formulation for finishing, brickwork, and plastering. Superior workability with enhanced bond strength for architectural detailing.
                </p>
                <Link
                  href="/media/"
                  className="inline-flex items-center gap-2 text-secondary text-sm font-semibold hover:text-secondary-container transition-colors"
                >
                  Request technical specifications
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
              <div className="relative min-h-[300px]">
                <Image
                  src="/images/real/home-cement-workers.webp"
                  alt="Cement workers on site"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Data */}
      <section className="py-14 md:py-24 px-6 lg:px-10 bg-stone-900/40">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Quality Assurance
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight mb-4">
              Technical Data &amp; Compliance
            </h2>
            <p className="text-stone-500 leading-relaxed mb-8">
              All Resident products undergo rigorous testing to exceed NIS and international benchmarks.
            </p>
            <div className="glass-card-gold p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4 text-stone-400">Certifications</p>
              <div className="space-y-3">
                {["EN 197-1", "NIS ISO 9001", "ASTM C150"].map((cert) => (
                  <div key={cert} className="flex justify-between items-center pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-sm font-semibold">{cert}</span>
                    <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-3">
            {[
              ["PLC Product Data Sheet (PDS)", "PDF \u2022 2.4 MB \u2022 Rev 2025"],
              ["OPC 52.5N Safety Data Sheet (SDS)", "PDF \u2022 1.1 MB \u2022 Rev 2025"],
              ["Industrial Application Guide", "PDF \u2022 8.7 MB \u2022 Full Catalog"],
              ["Masonry Cement Technical Sheet", "PDF \u2022 1.8 MB \u2022 Rev 2025"],
            ].map(([title, meta]) => (
              <div key={title} className="group bg-stone-900 border border-white/5 p-6 flex items-center justify-between hover:bg-secondary/10 hover:border-secondary/20 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-2xl text-stone-600 group-hover:text-secondary transition-colors">description</span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-[10px] uppercase text-stone-600 tracking-[0.15em]">{meta}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-stone-600 group-hover:text-secondary group-hover:translate-x-1 transition-all">download</span>
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
              Ready to Order?
            </h2>
            <p className="text-white/70">
              Access our dealer portal or contact sales for bulk pricing.
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://rcdportal.nyamabo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white text-stone-950 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-colors"
            >
              Dealer Portal
            </a>
            <Link
              href="/b2b/"
              className="px-8 py-3.5 border border-white/30 text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-colors"
            >
              B2B Solutions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
