import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-950 text-white">
      {/* ═══════════════════════════════════════════════
          HERO — Full viewport, black with gold accent
      ═══════════════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            alt="Resident Cement manufacturing plant"
            src="/images/real/home-background-hero.webp"
            fill
            sizes="100vw"
            className="object-cover opacity-50 grayscale-[30%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 h-full flex items-end pt-20">
          <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <span className="text-secondary text-[11px] font-bold uppercase tracking-[0.4em] mb-6 block">
                Industrial Excellence
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tight mb-6">
                Building
                <br />
                Nigeria&apos;s{" "}
                <span className="gold-gradient-text italic">Industrial</span>
                <br />
                Future
              </h1>
              <p className="text-stone-400 max-w-lg text-base leading-relaxed mb-8">
                A leading producer of high-quality cement in Nigeria. State-of-the-art
                greenfield plant in Bauchi State with 10 million metric tonnes
                annual capacity.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products/"
                  className="bg-secondary text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all"
                >
                  Explore Products
                </Link>
                <Link
                  href="/media/"
                  className="border border-white/20 text-white/80 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all"
                >
                  Request Quote
                </Link>
              </div>
            </div>

            {/* Glassmorphism stat card */}
            <div className="lg:col-span-5 glass-stat p-8 space-y-6 hidden lg:block">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 block mb-2">
                  Annual Output
                </span>
                <div className="text-4xl font-black font-headline text-white">
                  10M Tonnes
                </div>
                <div className="w-full bg-white/5 h-[2px] mt-4">
                  <div className="bg-secondary h-full w-[85%]" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 block mb-2">
                  Strength Class
                </span>
                <div className="text-4xl font-black font-headline text-white">
                  42.5R
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  EN 197-1 (2000) Certified &middot; Export Quality
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/about/"
                  className="text-secondary font-bold uppercase text-[11px] tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Learn More{" "}
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STAKEHOLDER PORTALS — Dark cards with gold hover
      ═══════════════════════════════════════════════ */}
      <section className="bg-stone-950 py-20 px-6 lg:px-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <span className="text-secondary text-[11px] font-bold uppercase tracking-[0.4em]">
              Direct Portals
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3">
              Stakeholder Resources
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/5">
            <Link
              href="/products/"
              className="bg-stone-950 p-10 group hover:bg-stone-900 transition-all"
            >
              <span className="material-symbols-outlined text-3xl text-secondary mb-6 group-hover:text-secondary-container transition-colors">
                precision_manufacturing
              </span>
              <h3 className="text-xl font-bold mb-3 group-hover:text-secondary-container transition-colors">
                Distributors &amp; Dealers
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                Manage bulk orders, track logistics, and access technical
                product data sheets.
              </p>
              <div className="h-[2px] w-10 bg-secondary group-hover:w-full transition-all duration-500" />
            </Link>
            <a
              href="https://rcdportal.nyamabo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-stone-950 p-10 group hover:bg-stone-900 transition-all"
            >
              <span className="material-symbols-outlined text-3xl text-secondary mb-6 group-hover:text-secondary-container transition-colors">
                storefront
              </span>
              <h3 className="text-xl font-bold mb-3 group-hover:text-secondary-container transition-colors">
                B2B Portal
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                Access the dealer portal for ordering, invoicing, and
                distribution management.
              </p>
              <div className="h-[2px] w-10 bg-secondary group-hover:w-full transition-all duration-500" />
            </a>
            <Link
              href="/team/"
              className="bg-stone-950 p-10 group hover:bg-stone-900 transition-all"
            >
              <span className="material-symbols-outlined text-3xl text-secondary mb-6 group-hover:text-secondary-container transition-colors">
                corporate_fare
              </span>
              <h3 className="text-xl font-bold mb-3 group-hover:text-secondary-container transition-colors">
                Corporate &amp; Leadership
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                Meet our management board, advisory council, and leadership
                team.
              </p>
              <div className="h-[2px] w-10 bg-secondary group-hover:w-full transition-all duration-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          ABOUT OVERVIEW — Split layout, dark
      ═══════════════════════════════════════════════ */}
      <section className="bg-stone-900 py-20 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-secondary text-[11px] font-bold uppercase tracking-[0.4em] mb-4 block">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-6">
              Redefining the
              <br />
              <span className="italic text-stone-400">Cement Industry</span>
            </h2>
            <p className="text-stone-400 text-[15px] leading-relaxed mb-5">
              Resident Cement Bachi Ltd is a leading producer of
              high-quality cement, registered as a Limited Liability Company
              under the Corporate Affairs Commission of Nigeria with acquired
              mining licenses throughout the Federal Republic.
            </p>
            <p className="text-stone-500 text-sm leading-relaxed mb-8">
              Located in Gwana District, Alkaleri LGA, Bauchi State, our
              state-of-the-art greenfield plant is designed to produce ten
              million metric tonnes of cement annually, leveraging cutting-edge
              technology from our strategic partnership with Sinoma.
            </p>
            <div className="flex gap-10 mb-8">
              <div>
                <div className="text-3xl font-black text-secondary">10M</div>
                <div className="text-[10px] text-stone-600 uppercase tracking-[0.2em] mt-1">
                  Tonnes / Year
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-secondary">42.5R</div>
                <div className="text-[10px] text-stone-600 uppercase tracking-[0.2em] mt-1">
                  Strength Class
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-secondary">EN 197</div>
                <div className="text-[10px] text-stone-600 uppercase tracking-[0.2em] mt-1">
                  Certified
                </div>
              </div>
            </div>
            <Link
              href="/about/"
              className="text-secondary font-bold uppercase text-[11px] tracking-[0.2em] inline-flex items-center gap-2 group"
            >
              Learn More
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              alt="Cement plant facility at sunset"
              src="/images/real/about-cement-facility-1.webp"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PRODUCTS — Gold accent cards on dark
      ═══════════════════════════════════════════════ */}
      <section className="bg-stone-950 py-20 px-6 lg:px-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-secondary text-[11px] font-bold uppercase tracking-[0.4em] mb-3 block">
                Our Products
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Premium Materials
              </h2>
            </div>
            <Link
              href="/products/"
              className="text-secondary font-bold uppercase text-[11px] tracking-[0.2em] flex items-center gap-2 group"
            >
              View Catalog
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_right_alt
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-900 group cursor-pointer hover:bg-stone-800/80 transition-all">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  alt="Resident Cement 50kg bag"
                  src="/images/real/about-cement-facility-2.webp"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] text-stone-600 font-bold uppercase tracking-[0.2em]">
                  EN 197-1 Certified
                </span>
                <h4 className="text-lg font-bold mt-1">
                  Limestone Cement 42.5R
                </h4>
                <p className="text-stone-500 text-sm mt-2">
                  Export quality. 3X Versatile, Reliable, Strong. 50kg bags.
                </p>
              </div>
            </div>

            <div className="bg-stone-900 group cursor-pointer hover:bg-stone-800/80 transition-all">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  alt="Cement production facility"
                  src="/images/real/home-concrete-plant.webp"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] text-stone-600 font-bold uppercase tracking-[0.2em]">
                  General Purpose
                </span>
                <h4 className="text-lg font-bold mt-1">
                  Ordinary Portland Cement
                </h4>
                <p className="text-stone-500 text-sm mt-2">
                  Structural concrete, masonry, and general construction.
                </p>
              </div>
            </div>

            <div className="bg-stone-900 group cursor-pointer hover:bg-stone-800/80 transition-all">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  alt="Cement manufacturing infrastructure"
                  src="/images/real/home-cement-workers.webp"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] text-stone-600 font-bold uppercase tracking-[0.2em]">
                  Eco-Friendly
                </span>
                <h4 className="text-lg font-bold mt-1">
                  Portland Limestone Cement
                </h4>
                <p className="text-stone-500 text-sm mt-2">
                  Lower carbon footprint with excellent workability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SINOMA PARTNERSHIP — Feature section
      ═══════════════════════════════════════════════ */}
      <section className="bg-black py-20 px-6 lg:px-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-video overflow-hidden">
            <Image
              alt="Sinoma and Resident Cement signing ceremony"
              src="/images/real/gallery-site-visit-2.webp"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <span className="text-secondary text-[11px] font-bold uppercase tracking-[0.4em] mb-4 block">
              Strategic Partnership
            </span>
            <h2 className="text-3xl md:text-4xl font-black leading-tight mb-5">
              Sinoma &times;{" "}
              <span className="italic text-stone-400">Resident Cement</span>
            </h2>
            <p className="text-stone-400 text-[15px] leading-relaxed mb-5">
              A Strategic Cooperation Agreement with Sinoma (CBMI Construction
              Co., Ltd.) for the engineering, procurement, and construction of
              our world-class cement plant in Bauchi State.
            </p>
            <p className="text-stone-500 text-sm leading-relaxed mb-8">
              This partnership brings decades of global cement engineering
              expertise, ensuring cutting-edge technology and international best
              practices in every phase of construction and operations.
            </p>
            <div className="flex gap-8">
              {[
                ["EPC", "Full Turnkey"],
                ["Gwana", "Bauchi State"],
                ["10M", "Tonnes / Year"],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="text-xl font-black text-secondary">
                    {value}
                  </div>
                  <div className="text-[10px] text-stone-600 uppercase tracking-[0.15em] mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          B2B SOLUTIONS — Glass cards on dark
      ═══════════════════════════════════════════════ */}
      <section className="bg-stone-950 py-20 px-6 lg:px-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <span className="text-secondary text-[11px] font-bold uppercase tracking-[0.4em] mb-4 block">
                B2B Solutions
              </span>
              <h2 className="text-4xl font-black leading-[1.05] tracking-tight mb-5">
                Your Supply
                <br />
                <span className="italic text-stone-400">Partner</span>
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                Whether you are a distributor, contractor, or construction
                firm, our Dealer Portal gives you the tools to manage orders,
                track deliveries, and grow with Resident Cement.
              </p>
              <a
                href="https://rcdportal.nyamabo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-secondary text-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all"
              >
                Open Dealer Account
              </a>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                [
                  "inventory_2",
                  "Bulk Ordering",
                  "Place and manage large-volume orders with transparent pricing through a dedicated digital portal.",
                ],
                [
                  "local_shipping",
                  "Fleet Logistics",
                  "Real-time delivery tracking and automated fleet coordination for seamless site delivery.",
                ],
                [
                  "support_agent",
                  "Account Management",
                  "A dedicated account manager for every dealer, ensuring responsive and personalized service.",
                ],
                [
                  "receipt_long",
                  "Invoicing & Credit",
                  "Automated invoicing, payment tracking, and flexible credit terms for qualified partners.",
                ],
              ].map(([icon, title, desc]) => (
                <div
                  key={title}
                  className="glass-card-gold p-7 hover:bg-secondary/10 transition-all group"
                >
                  <span className="material-symbols-outlined text-secondary text-2xl mb-4 group-hover:text-secondary-container transition-colors">
                    {icon}
                  </span>
                  <h4 className="font-bold text-white text-[15px] mb-2">
                    {title}
                  </h4>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MISSION / VISION / VALUES — Monolithic cards
      ═══════════════════════════════════════════════ */}
      <section className="bg-stone-900 py-20 px-6 lg:px-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Our Foundation
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/5">
            <div className="bg-stone-900 p-8">
              <div className="w-10 h-10 bg-secondary/10 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-secondary text-xl">
                  flag
                </span>
              </div>
              <h3 className="text-lg font-bold mb-3">Our Mission</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                To produce high-quality cement that is affordable, reliable,
                and accessible to all. To foster sustainable industrial growth
                and contribute to Nigeria&apos;s economic development through
                job creation and export-driven strategies.
              </p>
            </div>
            <div className="bg-stone-900 p-8">
              <div className="w-10 h-10 bg-secondary/10 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-secondary text-xl">
                  visibility
                </span>
              </div>
              <h3 className="text-lg font-bold mb-3">Our Vision</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                To become a global leader in cement production, setting
                benchmarks for quality, innovation, and sustainability while
                contributing to the economic transformation of Nigeria and
                Africa.
              </p>
            </div>
            <div className="bg-stone-900 p-8">
              <div className="w-10 h-10 bg-secondary/10 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-secondary text-xl">
                  diamond
                </span>
              </div>
              <h3 className="text-lg font-bold mb-3">Core Values</h3>
              <ul className="text-stone-500 text-sm leading-relaxed space-y-1.5">
                <li>
                  <strong className="text-stone-300">Quality</strong> — Highest
                  standards in every batch
                </li>
                <li>
                  <strong className="text-stone-300">Innovation</strong> —
                  Cutting-edge technology
                </li>
                <li>
                  <strong className="text-stone-300">Sustainability</strong> —
                  Eco-friendly at every stage
                </li>
                <li>
                  <strong className="text-stone-300">Empowerment</strong> —
                  Community uplift through jobs
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA BANNER — Gold gradient
      ═══════════════════════════════════════════════ */}
      <section className="bg-stone-950 py-20 px-6 lg:px-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto gold-gradient p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
              Ready to Build?
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed">
              Join the network of dealers and contractors choosing Resident
              Cement for structural permanence.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <a
              href="https://rcdportal.nyamabo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-stone-900 px-8 py-4 text-[11px] font-extrabold uppercase tracking-[0.15em] hover:scale-[1.02] transition-transform text-center"
            >
              Open Dealer Account
            </a>
            <Link
              href="/media/"
              className="border border-white/30 text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-all text-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
