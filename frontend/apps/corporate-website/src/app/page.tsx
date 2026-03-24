import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, Verified, Leaf, Truck, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9f8]">
      {/* Glass Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#f9f9f8]/70 backdrop-blur-md border-b border-[#e2e2e2]/50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#745b17] rounded"></div>
            <span className="text-xl font-headline font-bold text-[#1a1c1c] tracking-tight">Resident Cement</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-12">
            <Link href="/" className="text-[#745b17] border-b-2 border-[#745b17] pb-1 text-sm font-medium tracking-wide">
              Home
            </Link>
            <Link href="/about" className="text-[#1a1c1c] hover:text-[#745b17] transition-colors text-sm font-medium tracking-wide">
              About
            </Link>
            <Link href="/products" className="text-[#1a1c1c] hover:text-[#745b17] transition-colors text-sm font-medium tracking-wide">
              Products
            </Link>
            <Link href="/investors" className="text-[#1a1c1c] hover:text-[#745b17] transition-colors text-sm font-medium tracking-wide">
              Investors
            </Link>
          </div>

          {/* Search + CTA */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-[#eeeeed] px-4 py-2 rounded">
              <Search className="w-4 h-4 text-[#7e7667] mr-2" />
              <input
                type="text"
                placeholder="Search infrastructure..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 text-[#1a1c1c] placeholder:text-[#7e7667]"
              />
            </div>
            <button className="bg-[#745b17] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity">
              Order Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Modern architectural monolith"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26, 28, 28, 0.8), rgba(26, 28, 28, 0.2))' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-24 max-w-7xl mx-auto">
          <span className="text-[#c5a55a] font-bold tracking-[0.3em] uppercase mb-6 block text-sm">Industrial Excellence</span>
          <h1 className="font-headline text-6xl md:text-8xl text-white font-extrabold leading-tight tracking-tighter mb-8 max-w-4xl">
            Built for Generations
          </h1>
          <p className="text-[#f9f9f8] text-lg md:text-xl max-w-xl font-light leading-relaxed mb-12 opacity-90">
            Architectural grade foundations engineered for permanence. We provide the structural soul for tomorrow&apos;s landmarks.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button
              className="px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] rounded transition-all hover:opacity-90 text-white"
              style={{ background: 'linear-gradient(45deg, #745B17, #C5A55A)' }}
            >
              Request Quote
            </button>
            <button className="border border-white/30 backdrop-blur-md text-white px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] rounded hover:bg-white/10 transition-all">
              Explore Materials
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.4em] mb-4">Discovery</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </header>

      {/* Features Bento Grid */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quality */}
          <div className="p-10 bg-[#f4f4f3] rounded border-l-2 border-[#c5a55a]/30 hover:bg-white transition-all group">
            <Verified className="text-[#745b17] text-4xl mb-8" strokeWidth={1.5} />
            <h3 className="font-headline text-2xl font-bold mb-4 text-[#1a1c1c]">Product Quality</h3>
            <p className="text-[#4d4639] leading-relaxed">Nano-engineered aggregates ensuring compressive strength that exceeds global industrial standards by 40%.</p>
            <div className="mt-8 h-[1px] w-0 group-hover:w-full bg-[#745b17] transition-all duration-500" />
          </div>

          {/* Sustainability */}
          <div className="p-10 bg-[#f4f4f3] rounded border-l-2 border-[#c5a55a]/30 hover:bg-white transition-all group">
            <Leaf className="text-[#745b17] text-4xl mb-8" strokeWidth={1.5} />
            <h3 className="font-headline text-2xl font-bold mb-4 text-[#1a1c1c]">Sustainability</h3>
            <p className="text-[#4d4639] leading-relaxed">Carbon-neutral manufacturing processes and recycled raw materials for the next century of green building.</p>
            <div className="mt-8 h-[1px] w-0 group-hover:w-full bg-[#745b17] transition-all duration-500" />
          </div>

          {/* Logistics */}
          <div className="p-10 bg-[#f4f4f3] rounded border-l-2 border-[#c5a55a]/30 hover:bg-white transition-all group">
            <Truck className="text-[#745b17] text-4xl mb-8" strokeWidth={1.5} />
            <h3 className="font-headline text-2xl font-bold mb-4 text-[#1a1c1c]">B2B Logistics</h3>
            <p className="text-[#4d4639] leading-relaxed">Real-time supply chain tracking and automated fleet management for seamless site delivery integration.</p>
            <div className="mt-8 h-[1px] w-0 group-hover:w-full bg-[#745b17] transition-all duration-500" />
          </div>
        </div>
      </section>

      {/* Our Materials Section */}
      <section className="bg-[#eeeeed] py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-headline text-5xl font-extrabold text-[#1a1c1c] mb-6 tracking-tight">Our Materials</h2>
              <p className="text-[#4d4639] text-lg">The foundational components of modern infrastructure, refined for specific architectural needs.</p>
            </div>
            <button className="text-[#745b17] font-bold uppercase tracking-widest text-sm flex items-center gap-2 group">
              View Catalog
              <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Product Card 1 */}
            <div className="bg-white p-4 rounded group cursor-pointer shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-square bg-[#eeeeed] rounded mb-6 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1000&auto=format&fit=crop"
                  alt="Premium cement bag"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <span className="text-[10px] text-[#7e7667] font-bold uppercase tracking-widest">Type GU</span>
              <h4 className="font-headline text-xl font-bold mt-1 text-[#1a1c1c]">Elite Portland</h4>
              <p className="text-[#745b17] font-bold mt-4">$24.50 <span className="text-[#4d4639] font-normal text-xs">/ unit</span></p>
            </div>

            {/* Product Card 2 */}
            <div className="bg-white p-4 rounded group cursor-pointer shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-square bg-[#eeeeed] rounded mb-6 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=1000&auto=format&fit=crop"
                  alt="Concrete blocks"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <span className="text-[10px] text-[#7e7667] font-bold uppercase tracking-widest">Pre-Cast</span>
              <h4 className="font-headline text-xl font-bold mt-1 text-[#1a1c1c]">Monolith Blocks</h4>
              <p className="text-[#745b17] font-bold mt-4">$112.00 <span className="text-[#4d4639] font-normal text-xs">/ block</span></p>
            </div>

            {/* Product Card 3 */}
            <div className="bg-white p-4 rounded group cursor-pointer shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-square bg-[#eeeeed] rounded mb-6 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1534260164206-187827c9d914?q=80&w=1000&auto=format&fit=crop"
                  alt="Aggregate mix"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <span className="text-[10px] text-[#7e7667] font-bold uppercase tracking-widest">Aggregate</span>
              <h4 className="font-headline text-xl font-bold mt-1 text-[#1a1c1c]">Titanium Grit</h4>
              <p className="text-[#745b17] font-bold mt-4">$85.00 <span className="text-[#4d4639] font-normal text-xs">/ ton</span></p>
            </div>

            {/* Product Card 4 */}
            <div className="bg-white p-4 rounded group cursor-pointer shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-square bg-[#eeeeed] rounded mb-6 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1541888946425-d81bb1924f7a?q=80&w=1000&auto=format&fit=crop"
                  alt="Specialty concrete mix"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <span className="text-[10px] text-[#7e7667] font-bold uppercase tracking-widest">Custom</span>
              <h4 className="font-headline text-xl font-bold mt-1 text-[#1a1c1c]">Hydro-Seal Mix</h4>
              <p className="text-[#745b17] font-bold mt-4">Quote Only</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Projects */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <h2 className="font-headline text-5xl font-extrabold text-[#1a1c1c] mb-16 tracking-tight text-center">Latest Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[800px]">
          {/* Large Featured Image */}
          <div className="md:col-span-8 relative group overflow-hidden rounded shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2070&auto=format&fit=crop"
              alt="Bridge construction"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-12 flex flex-col justify-end">
              <span className="text-[#ffdf99] uppercase tracking-widest text-xs mb-4">Infrastructure</span>
              <h3 className="text-white font-headline text-3xl font-bold">The Meridian Viaduct</h3>
              <p className="text-white/70 max-w-md mt-4">120,000 cubic meters of Type V High-Sulfate resistance cement utilized for long-term maritime durability.</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-4 grid grid-rows-2 gap-4">
            <div className="relative group overflow-hidden rounded shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                alt="High rise foundation"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                <h3 className="text-white font-headline text-xl font-bold">Apex Plaza</h3>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000&auto=format&fit=crop"
                alt="Modern museum"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                <h3 className="text-white font-headline text-xl font-bold">Museum of Form</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-32 px-8">
        <div
          className="max-w-7xl mx-auto p-20 rounded flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(45deg, #745B17, #C5A55A)' }}
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-xl text-center md:text-left mb-12 md:mb-0">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to break ground?</h2>
            <p className="text-white/80 text-lg leading-relaxed">Join the network of elite builders choosing Resident Cement for structural permanence. Our logistical team is ready to scale with your project.</p>
          </div>
          <div className="relative z-10 flex flex-col gap-4">
            <button className="bg-white text-[#745b17] px-12 py-6 rounded text-sm font-extrabold uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-transform">
              Request Quote
            </button>
            <p className="text-white/60 text-[10px] text-center uppercase tracking-widest">Average response time: 2 hours</p>
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
          <Link href="/products" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17] transition-colors">Products</Link>
          <Link href="/contact" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17] transition-colors">Contact</Link>
          <Link href="/privacy" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17] transition-colors">Privacy</Link>
          <Link href="/terms" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17] transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
