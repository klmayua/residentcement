import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Download, Description } from "lucide-react";

const products = [
  {
    id: "plc",
    name: "Portland Limestone (PLC)",
    grade: "Eco-Efficient",
    description:
      "Engineered for high early strength and reduced carbon footprint. Ideal for residential developments and general-purpose structural masonry.",
    features: ["Rapid Setting", "Residential Grade"],
    specs: { earlyStrength: "Rapid Setting", usage: "Residential" },
  },
  {
    id: "opc",
    name: "Ordinary Portland (OPC)",
    grade: "Grade 52.5N",
    description:
      "The structural foundation of nations. Grade 52.5N for massive infrastructure, including bridges, dams, and 100MW power installations.",
    applications: ["Heavy Civil Works", "Marine Environments", "High-Rise Structural"],
  },
  {
    id: "masonry",
    name: "Masonry Cement",
    grade: "Finishing",
    description:
      "Specialized formulation for finishing, brickwork, and plastering. Superior workability with enhanced bond strength for architectural detailing.",
  },
];

const downloads = [
  { title: "PLC Product Data Sheet (PDS)", size: "2.4 MB", rev: "2024" },
  { title: "OPC 52.5N Safety Data Sheets (SDS)", size: "1.1 MB", rev: "2024" },
  { title: "Industrial Application Guide", size: "8.7 MB", rev: "Full Catalog" },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[921px] w-full flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=2070&auto=format&fit=crop"
            alt="Industrial cement plant at dusk"
            fill
            className="object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>

        <div className="relative z-10 container-full px-6 sm:px-8 lg:px-12 xl:px-16 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-end pb-24">
          <div className="space-y-8">
            <span className="inline-block bg-secondary text-white px-4 py-1 text-xs tracking-[0.2em] uppercase font-bold">
              Industrial Standard
            </span>
            <h1 className="text-6xl md:text-8xl font-headline text-white leading-[0.9] tracking-tighter">
              Precision in Every Molecule.
            </h1>
            <div className="flex items-center gap-8">
              <div className="border-l-4 border-secondary pl-6">
                <p className="text-white text-4xl font-headline">10Mt</p>
                <p className="text-stone-400 text-xs uppercase tracking-widest font-body">
                  Annual Capacity
                </p>
              </div>
              <p className="text-stone-300 max-w-xs text-sm leading-relaxed">
                Resident Cement represents the pinnacle of structural integrity, engineered for the most
                demanding architectural marvels of the century.
              </p>
            </div>
          </div>

          <div className="flex justify-end hidden md:flex">
            <div className="w-80 h-[450px] bg-stone-900 p-2 relative overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1518005068251-37900150dfca?q=80&w=800&auto=format&fit=crop"
                alt="Cement bag product"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Portfolio: Bento Grid */}
      <section className="section-padding bg-surface">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-20 space-y-4">
            <p className="text-secondary font-bold text-xs tracking-widest uppercase">The Collection</p>
            <h2 className="text-5xl md:text-6xl font-headline tracking-tighter">Product Portfolio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* PLC */}
            <div className="md:col-span-7 bg-surface-container-high p-12 flex flex-col justify-between min-h-[500px]">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-4xl font-headline italic">Portland Limestone (PLC)</h3>
                  <span className="text-xs font-body px-3 py-1 bg-white border border-stone-200 uppercase font-bold tracking-tighter">
                    Eco-Efficient
                  </span>
                </div>
                <p className="text-stone-600 max-w-md leading-relaxed">
                  Engineered for high early strength and reduced carbon footprint. Ideal for residential
                  developments and general-purpose structural masonry.
                </p>
              </div>
              <div className="flex items-center gap-12 mt-12">
                <div className="space-y-1">
                  <p className="text-xs text-stone-400 uppercase">Early Strength</p>
                  <p className="font-headline text-xl">Rapid Setting</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-stone-400 uppercase">Usage</p>
                  <p className="font-headline text-xl">Residential</p>
                </div>
                <button className="ml-auto text-xs uppercase tracking-[0.2em] font-bold border-b-2 border-secondary pb-1">
                  Specifications
                </button>
              </div>
            </div>

            {/* OPC */}
            <div className="md:col-span-5 bg-primary text-white p-12 flex flex-col justify-between min-h-[500px]">
              <div className="space-y-6">
                <h3 className="text-4xl font-headline italic">Ordinary Portland (OPC)</h3>
                <p className="text-stone-400 leading-relaxed">
                  The structural foundation of nations. Grade 52.5N for massive infrastructure, including
                  bridges, dams, and 100MW power installations.
                </p>
              </div>
              <div className="space-y-8">
                <div className="h-[1px] bg-stone-800 w-full" />
                <ul className="space-y-3 font-body text-xs uppercase tracking-widest">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-secondary" />
                    Heavy Civil Works
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-secondary" />
                    Marine Environments
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-secondary" />
                    High-Rise Structural
                  </li>
                </ul>
              </div>
            </div>

            {/* Masonry */}
            <div className="md:col-span-12 bg-surface-container-low grid md:grid-cols-2 overflow-hidden">
              <div className="p-12 flex flex-col justify-center space-y-8">
                <h3 className="text-4xl font-headline">Masonry Cement</h3>
                <p className="text-stone-600 leading-relaxed">
                  Specialized formulation for finishing, brickwork, and plastering. Superior workability
                  with enhanced bond strength for architectural detailing.
                </p>
                <div>
                  <button className="btn-primary">View Technical Sheet</button>
                </div>
              </div>
              <div className="relative min-h-[400px]">
                <Image
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop"
                  alt="Mason applying cement"
                  fill
                  className="object-cover grayscale"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Applications */}
      <section className="bg-black text-white py-32 overflow-hidden">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16 mb-20">
          <h2 className="text-6xl md:text-8xl font-headline italic tracking-tighter mb-4 opacity-10">Scale</h2>
          <h2 className="text-4xl md:text-5xl font-headline -mt-16 md:-mt-20">Resident in Action</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-0">
          <div className="flex-1 group relative h-[600px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop"
              alt="Modern skyscraper"
              fill
              className="object-cover grayscale transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 p-12 flex flex-col justify-end">
              <p className="text-secondary font-bold text-xs tracking-widest uppercase mb-2">Metropolis</p>
              <h4 className="text-3xl font-headline">Skyscrapers</h4>
            </div>
          </div>
          <div className="flex-1 group relative h-[600px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop"
              alt="Concrete bridge"
              fill
              className="object-cover grayscale transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 p-12 flex flex-col justify-end">
              <p className="text-secondary font-bold text-xs tracking-widest uppercase mb-2">Infrastructure</p>
              <h4 className="text-3xl font-headline">Bridges & Roads</h4>
            </div>
          </div>
          <div className="flex-1 group relative h-[600px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop"
              alt="Power plant facility"
              fill
              className="object-cover grayscale transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 p-12 flex flex-col justify-end">
              <p className="text-secondary font-bold text-xs tracking-widest uppercase mb-2">Energy</p>
              <h4 className="text-3xl font-headline">100MW Stations</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Data Sheets */}
      <section className="section-padding bg-surface-container-lowest">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
            <div className="md:w-1/3">
              <h2 className="text-4xl font-headline mb-6 leading-tight">Technical Data & Benchmarks</h2>
              <p className="text-stone-500 mb-8 font-body">
                All Resident products undergo rigorous testing to exceed NIS (Nigerian Industrial Standards)
                and ASTM international benchmarks.
              </p>
              <div className="bg-surface-container-high p-8">
                <p className="text-[10px] uppercase tracking-widest font-bold mb-4 text-stone-400">Compliance</p>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-stone-300 pb-2">
                    <span className="text-xs font-bold">NIS ISO 9001</span>
                    <Check className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex justify-between border-b border-stone-300 pb-2">
                    <span className="text-xs font-bold">ASTM C150</span>
                    <Check className="w-4 h-4 text-secondary" />
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-2/3 space-y-4">
              {downloads.map((download) => (
                <div
                  key={download.title}
                  className="group bg-white p-8 flex items-center justify-between hover:bg-black hover:text-white transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <Description className="w-10 h-10 opacity-30" />
                    <div>
                      <p className="text-lg font-headline">{download.title}</p>
                      <p className="text-[10px] uppercase text-stone-400">
                        PDF • {download.size} • Rev {download.rev}
                      </p>
                    </div>
                  </div>
                  <Download className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sinoma Partnership */}
      <section className="relative section-padding bg-primary overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop"
            alt="Laboratory testing"
            fill
            className="object-cover grayscale"
          />
        </div>
        <div className="relative z-10 container-full px-6 sm:px-8 lg:px-12 xl:px-16 max-w-4xl">
          <span className="text-secondary font-bold text-xs tracking-widest uppercase block mb-4">
            Technical Excellence
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline text-white mb-8 leading-tight">
            The Sinoma Standard
          </h2>
          <p className="text-xl text-stone-300 font-headline italic mb-12">
            &ldquo;Our partnership with Sinoma Nigeria ensures that every bag of Resident Cement is backed
            by world-class engineering and automated laboratory precision.&rdquo;
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <p className="text-white font-headline text-3xl mb-1">100%</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-500">Automated Analysis</p>
            </div>
            <div>
              <p className="text-white font-headline text-3xl mb-1">X-Ray</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-500">Fluorescence Testing</p>
            </div>
            <div>
              <p className="text-white font-headline text-3xl mb-1">24/7</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-500">Quality Monitoring</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
