import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Download, Description, Search } from "lucide-react";

const products = [
  { id: "plc", name: "Portland Limestone (PLC)", grade: "Eco-Efficient", description: "Engineered for high early strength and reduced carbon footprint. Ideal for residential developments.", features: ["Rapid Setting", "Residential Grade"], specs: { earlyStrength: "Rapid Setting", usage: "Residential" } },
  { id: "opc", name: "Ordinary Portland (OPC)", grade: "Grade 52.5N", description: "The structural foundation of nations. Grade 52.5N for massive infrastructure.", applications: ["Heavy Civil Works", "Marine Environments", "High-Rise Structural"] },
  { id: "masonry", name: "Masonry Cement", grade: "Finishing", description: "Specialized formulation for finishing, brickwork, and plastering. Superior workability." },
];

const downloads = [
  { title: "PLC Product Data Sheet (PDS)", size: "2.4 MB", rev: "2024" },
  { title: "OPC 52.5N Safety Data Sheets (SDS)", size: "1.1 MB", rev: "2024" },
  { title: "Industrial Application Guide", size: "8.7 MB", rev: "Full Catalog" },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f8]">
      {/* Glass Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#f9f9f8]/70 backdrop-blur-md border-b border-[#e2e2e2]/50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#745b17] rounded"></div>
            <span className="text-xl font-headline font-bold text-[#1a1c1c] tracking-tight">Resident Cement</span>
          </div>
          <div className="hidden md:flex items-center space-x-12">
            <Link href="/" className="text-[#1a1c1c] hover:text-[#745b17] transition-colors text-sm font-medium tracking-wide">Home</Link>
            <Link href="/about" className="text-[#1a1c1c] hover:text-[#745b17] transition-colors text-sm font-medium tracking-wide">About</Link>
            <Link href="/products" className="text-[#745b17] border-b-2 border-[#745b17] pb-1 text-sm font-medium tracking-wide">Products</Link>
            <Link href="/sustainability" className="text-[#1a1c1c] hover:text-[#745b17] transition-colors text-sm font-medium tracking-wide">Sustainability</Link>
          </div>
          <button className="bg-[#745b17] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity">Order Now</button>
        </div>
      </nav>

      <div className="pt-20">
        {/* Hero */}
        <section className="relative h-[80vh] min-h-[600px] w-full flex items-center overflow-hidden bg-[#1a1c1c]">
          <div className="absolute inset-0 z-0">
            <Image src="https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=2070&auto=format&fit=crop" alt="Cement plant" fill className="object-cover opacity-40 grayscale" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1c1c] via-[#1a1c1c]/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-3xl">
              <span className="inline-block bg-[#745b17] text-white px-4 py-1 text-xs tracking-[0.2em] uppercase font-bold rounded mb-8">Industrial Standard</span>
              <h1 className="text-6xl md:text-8xl font-headline text-white leading-[0.9] tracking-tighter mb-8">Precision in Every Molecule.</h1>
              <div className="flex items-center gap-8">
                <div className="border-l-4 border-[#c5a55a] pl-6">
                  <p className="text-white text-4xl font-headline">10Mt</p>
                  <p className="text-[#a8a29e] text-xs uppercase tracking-widest">Annual Capacity</p>
                </div>
                <p className="text-[#e8e8e7] max-w-xs text-sm leading-relaxed">Resident Cement represents the pinnacle of structural integrity, engineered for demanding architectural marvels.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Portfolio */}
        <section className="py-20 lg:py-28 px-8 bg-[#f9f9f8]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 space-y-4">
              <p className="text-[#745b17] font-bold text-xs tracking-widest uppercase">The Collection</p>
              <h2 className="text-5xl md:text-6xl font-headline tracking-tighter text-[#1a1c1c]">Product Portfolio</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* PLC Card */}
              <div className="md:col-span-7 bg-[#e8e8e7] p-10 lg:p-12 flex flex-col justify-between min-h-[450px] rounded group hover:bg-[#eeeeed] transition-colors">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-3xl lg:text-4xl font-headline italic text-[#1a1c1c]">Portland Limestone</h3>
                    <span className="text-[10px] px-3 py-1 bg-white border border-[#d0c5b4] uppercase font-bold tracking-tighter rounded text-[#745b17]">Eco-Efficient</span>
                  </div>
                  <p className="text-[#4d4639] max-w-md leading-relaxed">Engineered for high early strength and reduced carbon footprint. Ideal for residential developments.</p>
                </div>
                <div className="flex items-center gap-12 mt-12">
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#7e7667] uppercase tracking-widest">Early Strength</p>
                    <p className="font-headline text-xl text-[#1a1c1c]">Rapid Setting</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#7e7667] uppercase tracking-widest">Usage</p>
                    <p className="font-headline text-xl text-[#1a1c1c]">Residential</p>
                  </div>
                  <button className="ml-auto text-xs uppercase tracking-[0.2em] font-bold border-b-2 border-[#745b17] pb-1 text-[#745b17] hover:opacity-80">Specifications →</button>
                </div>
              </div>

              {/* OPC Card */}
              <div className="md:col-span-5 bg-[#745b17] text-white p-10 lg:p-12 flex flex-col justify-between min-h-[450px] rounded">
                <div className="space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-headline italic">Ordinary Portland</h3>
                  <p className="text-[#e8e8e7]/80 leading-relaxed">The structural foundation of nations. Grade 52.5N for massive infrastructure.</p>
                </div>
                <div className="space-y-8">
                  <div className="h-[1px] bg-[#c5a55a]/30 w-full" />
                  <ul className="space-y-3 text-xs uppercase tracking-widest text-[#e8e8e7]">
                    <li className="flex items-center gap-3"><span className="w-2 h-2 bg-[#c5a55a]" />Heavy Civil Works</li>
                    <li className="flex items-center gap-3"><span className="w-2 h-2 bg-[#c5a55a]" />Marine Environments</li>
                    <li className="flex items-center gap-3"><span className="w-2 h-2 bg-[#c5a55a]" />High-Rise Structural</li>
                  </ul>
                </div>
              </div>

              {/* Masonry Card */}
              <div className="md:col-span-12 bg-[#f4f4f3] grid md:grid-cols-2 overflow-hidden rounded">
                <div className="p-10 lg:p-12 flex flex-col justify-center space-y-8">
                  <h3 className="text-4xl font-headline text-[#1a1c1c]">Masonry Cement</h3>
                  <p className="text-[#4d4639] leading-relaxed">Specialized formulation for finishing, brickwork, and plastering. Superior workability with enhanced bond strength.</p>
                  <button className="px-8 py-4 text-sm font-bold uppercase tracking-wider rounded text-white hover:opacity-90 transition-opacity w-fit" style={{ background: 'linear-gradient(45deg, #745B17, #C5A55A)' }}>View Technical Sheet</button>
                </div>
                <div className="relative min-h-[350px]">
                  <Image src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop" alt="Mason applying cement" fill className="object-cover grayscale" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="bg-[#1a1c1c] text-white overflow-hidden">
          <div className="py-16 px-8 max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline tracking-tighter mb-4">Resident in Action</h2>
            <p className="text-[#a8a29e] max-w-xl">From towering skyscrapers to critical infrastructure, our cement forms the foundation of progress.</p>
          </div>
          <div className="flex flex-col md:flex-row">
            {[
              { img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000", label: "Metropolis", title: "Skyscrapers" },
              { img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000", label: "Infrastructure", title: "Bridges" },
              { img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000", label: "Energy", title: "Power Stations" },
            ].map((item) => (
              <div key={item.title} className="flex-1 group relative h-[500px] overflow-hidden">
                <Image src={item.img} alt={item.title} fill className="object-cover grayscale transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 p-10 flex flex-col justify-end">
                  <p className="text-[#c5a55a] font-bold text-xs tracking-widest uppercase mb-2">{item.label}</p>
                  <h4 className="text-3xl font-headline">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Downloads */}
        <section className="py-20 lg:py-28 px-8 bg-[#eeeeed]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-4xl font-headline mb-6 leading-tight text-[#1a1c1c]">Technical Data & Benchmarks</h2>
              <p className="text-[#5f5e5e] mb-8">All Resident products undergo rigorous testing to exceed NIS and ASTM international benchmarks.</p>
              <div className="bg-[#e8e8e7] p-8 rounded">
                <p className="text-[10px] uppercase tracking-widest font-bold mb-4 text-[#7e7667]">Compliance</p>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-[#d0c5b4] pb-2">
                    <span className="text-xs font-bold text-[#1a1c1c]">NIS ISO 9001</span>
                    <Check className="w-4 h-4 text-[#745b17]" />
                  </div>
                  <div className="flex justify-between border-b border-[#d0c5b4] pb-2">
                    <span className="text-xs font-bold text-[#1a1c1c]">ASTM C150</span>
                    <Check className="w-4 h-4 text-[#745b17]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-2/3 space-y-4">
              {downloads.map((download) => (
                <div key={download.title} className="group bg-white p-8 flex items-center justify-between hover:bg-[#1a1c1c] hover:text-white transition-all cursor-pointer rounded">
                  <div className="flex items-center gap-6">
                    <Description className="w-10 h-10 opacity-30" />
                    <div>
                      <p className="text-lg font-headline">{download.title}</p>
                      <p className="text-[10px] uppercase text-[#7e7667] group-hover:text-[#a8a29e]">PDF • {download.size} • Rev {download.rev}</p>
                    </div>
                  </div>
                  <Download className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#f4f4f3] flex flex-col md:flex-row justify-between items-center px-12 py-12">
          <div className="flex flex-col items-center md:items-start gap-4 mb-8 md:mb-0">
            <div className="font-headline font-bold text-lg tracking-tight text-[#1a1c1c]">Resident Cement</div>
            <p className="text-xs uppercase tracking-widest text-[#7e7667]">&copy; 2024 Resident Cement. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <Link href="/about" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17] transition-colors">About</Link>
            <Link href="/contact" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17] transition-colors">Contact</Link>
            <Link href="/investors" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17] transition-colors">Investors</Link>
            <Link href="/privacy" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17] transition-colors">Privacy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
