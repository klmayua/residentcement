import Image from "next/image";
import Link from "next/link";
import { Diamond, Users, Award, Globe, Building2, Verified, ArrowRight } from "lucide-react";

const values = [
  { icon: Diamond, title: "Innovation", description: "Pushing the boundaries of molecular structural integrity through continuous R&D." },
  { icon: Verified, title: "Integrity", description: "Honesty in our source materials and transparency in our logistics operations." },
  { icon: Globe, title: "Longevity", description: "Reducing global waste by ensuring structures never need replacement." },
  { icon: Users, title: "Empowerment", description: "Creating jobs and empowering local communities through sustainable development." },
];

const milestones = [
  { year: "2023", title: "Company Founded", description: "Resident Cement Company Limited registered under Corporate Affairs Commission" },
  { year: "2024", title: "Mining Licenses Acquired", description: "Secured mining licenses throughout Nigeria" },
  { year: "2024", title: "Sinoma Partnership", description: "Strategic partnership with Sinoma Nigeria Company for technology transfer" },
  { year: "2025", title: "Bauchi Plant Construction", description: "Groundbreaking of $500M cement plant in Gwana District" },
  { year: "2026", title: "Production Launch", description: "Commercial production begins with 10 million tonnes annual capacity" },
];

export default function AboutPage() {
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
            <Link href="/about" className="text-[#745b17] border-b-2 border-[#745b17] pb-1 text-sm font-medium tracking-wide">About</Link>
            <Link href="/products" className="text-[#1a1c1c] hover:text-[#745b17] transition-colors text-sm font-medium tracking-wide">Products</Link>
            <Link href="/investors" className="text-[#1a1c1c] hover:text-[#745b17] transition-colors text-sm font-medium tracking-wide">Investors</Link>
          </div>
          <button className="bg-[#745b17] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity">Order Now</button>
        </div>
      </nav>

      <div className="pt-20">
        {/* Hero */}
        <section className="relative px-8 py-24 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <span className="text-[#745b17] font-bold text-sm uppercase tracking-[0.3em] mb-6 block">Our Identity</span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-black tracking-tighter leading-[0.9] text-[#1a1c1c]">
                Architectural <br />
                <span className="text-[#745b17]">Excellence</span> <br />Defined.
              </h1>
            </div>
            <div className="lg:col-span-4 pb-4">
              <p className="text-lg md:text-xl text-[#4d4639] leading-relaxed">Forging the future of urban landscapes through the relentless pursuit of structural permanence and aesthetic purity.</p>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <section className="px-8 mb-24">
          <div className="max-w-7xl mx-auto relative h-[400px] md:h-[600px] overflow-hidden rounded">
            <Image src="https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=2070&auto=format&fit=crop" alt="Industrial cement plant" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1c]/60 to-transparent" />
            <div className="absolute bottom-0 right-0 bg-[#f9f9f8] p-8 md:p-12 max-w-md hidden md:block rounded-tl">
              <h3 className="font-headline text-2xl font-bold mb-4 text-[#1a1c1c]">Built for Generations</h3>
              <p className="text-[#4d4639] text-sm leading-loose">We don&apos;t just supply material; we provide the backbone of legacy. Resident Cement is engineered to outlast the century.</p>
            </div>
          </div>
        </section>

        {/* Heritage Section */}
        <section className="bg-[#f4f4f3] py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-[4/5] bg-[#eeeeed] overflow-hidden rounded">
                  <Image src="https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=1000&auto=format&fit=crop" alt="Cement production" fill className="object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#745b17] p-6 flex flex-col justify-end rounded">
                  <span className="text-4xl font-headline font-black text-white leading-none">2025</span>
                  <span className="text-xs uppercase font-bold text-white tracking-widest mt-2">Production Start</span>
                </div>
              </div>

              <div className="lg:pl-8">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#745b17] mb-4 block">Our Heritage</span>
                <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-8 text-[#1a1c1c]">Our Mission & Vision</h2>
                <p className="text-[#4d4639] mb-8 leading-relaxed text-lg">To produce high-quality, affordable cement while contributing to Nigeria&apos;s economic development through job creation, sustainable industrial growth, and infrastructure advancement.</p>

                <div className="space-y-6 mb-10">
                  <div className="flex gap-4 items-start">
                    <Diamond className="h-6 w-6 text-[#745b17] shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-[#1a1c1c]">Purity of Material</h4>
                      <p className="text-sm text-[#4d4639]">Sourced from exclusive limestone deposits, processed with artisanal precision.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <Building2 className="h-6 w-6 text-[#745b17] shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-[#1a1c1c]">Architectural Trust</h4>
                      <p className="text-sm text-[#4d4639]">The preferred choice for the world&apos;s most demanding structural engineers.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#d0c5b4]">
                  {[
                    { value: "$500M", label: "Investment" },
                    { value: "10M", label: "Tons/Year" },
                    { value: "150MW", label: "Power Plant" },
                    { value: "36", label: "States Served" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center md:text-left">
                      <div className="text-2xl md:text-3xl font-headline font-bold text-[#745b17]">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-widest text-[#7e7667] mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Cards */}
        <section className="py-24 lg:py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start mb-16">
              <h2 className="font-headline text-4xl md:text-6xl font-black tracking-tighter mb-8 md:mb-0 text-[#1a1c1c]">The Mission</h2>
              <div className="max-w-lg md:text-right">
                <p className="text-xl italic text-[#4d4639]">&ldquo;To elevate the human experience by providing the foundation for spaces that inspire, protect, and endure.&rdquo;</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#eeeeed] p-10 flex flex-col justify-between aspect-square hover:bg-white transition-all group rounded">
                <span className="text-6xl font-headline text-[#d0c5b4] group-hover:text-[#745b17] transition-colors">01</span>
                <div>
                  <h3 className="text-2xl font-bold text-[#1a1c1c] mb-4">Innovation</h3>
                  <p className="text-sm text-[#4d4639]">Pushing the boundaries of molecular structural integrity through R&D.</p>
                </div>
              </div>

              <div className="p-10 flex flex-col justify-between aspect-square rounded" style={{ background: 'linear-gradient(45deg, #745B17, #C5A55A)' }}>
                <span className="text-6xl font-headline text-white/30">02</span>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Integrity</h3>
                  <p className="text-sm text-white/80">Honesty in our source materials and transparency in our logistics.</p>
                </div>
              </div>

              <div className="bg-[#eeeeed] p-10 flex flex-col justify-between aspect-square hover:bg-white transition-all group rounded">
                <span className="text-6xl font-headline text-[#d0c5b4] group-hover:text-[#745b17] transition-colors">03</span>
                <div>
                  <h3 className="text-2xl font-bold text-[#1a1c1c] mb-4">Longevity</h3>
                  <p className="text-sm text-[#4d4639]">Reducing global waste by ensuring structures never need replacement.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-[#eeeeed] py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#745b17] mb-4 block">Our Values</span>
              <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-6 text-[#1a1c1c]">The Principles That Guide Us</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="bg-white p-8 hover:shadow-lg transition-all group rounded">
                  <div className="w-12 h-12 bg-[#745b17]/10 flex items-center justify-center mb-6 group-hover:bg-[#745b17] transition-colors rounded">
                    <value.icon className="h-6 w-6 text-[#745b17] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-headline text-xl font-bold text-[#1a1c1c] mb-2">{value.title}</h3>
                  <p className="text-[#4d4639] text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 lg:py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#745b17] mb-4 block">Our Journey</span>
              <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-6 text-[#1a1c1c]">Milestones</h2>
            </div>

            <div className="max-w-3xl mx-auto">
              {milestones.map((milestone, idx) => (
                <div key={milestone.year} className="flex gap-6 mb-10 last:mb-0 group">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-[#745b17]/10 text-[#745b17] flex items-center justify-center font-bold border-2 border-[#745b17]/20 group-hover:bg-[#745b17] group-hover:text-white transition-colors rounded">
                      {milestone.year.slice(-2)}
                    </div>
                    {idx < milestones.length - 1 && <div className="w-0.5 flex-1 bg-[#d0c5b4] my-2" />}
                  </div>
                  <div className="pb-8 flex-1">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-[#745b17] mb-1">{milestone.year}</div>
                    <h3 className="font-headline text-xl font-bold text-[#1a1c1c] mb-2">{milestone.title}</h3>
                    <p className="text-[#4d4639]">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 lg:py-32 px-8 text-center relative overflow-hidden bg-[#f4f4f3]">
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-8 text-[#1a1c1c]">Ready to Build Your Legacy?</h2>
            <p className="text-[#4d4639] mb-12 text-lg">Partner with us for your next architectural masterwork.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-10 py-5 text-sm font-bold uppercase tracking-wider rounded text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(45deg, #745B17, #C5A55A)' }}>Start Project</Link>
              <Link href="/products" className="px-10 py-5 text-sm font-bold uppercase tracking-wider rounded border-2 border-[#745b17] text-[#745b17] hover:bg-[#745b17] hover:text-white transition-colors">Download Catalog</Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1a1c1c] flex flex-col md:flex-row justify-between items-center px-12 py-12">
          <div className="flex flex-col items-center md:items-start gap-4 mb-8 md:mb-0">
            <div className="font-headline font-bold text-lg tracking-tight text-white">Resident Cement</div>
            <p className="text-xs uppercase tracking-widest text-[#7e7667]">&copy; 2024 Resident Cement. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <Link href="/" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#c5a55a] transition-colors">Home</Link>
            <Link href="/products" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#c5a55a] transition-colors">Products</Link>
            <Link href="/contact" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#c5a55a] transition-colors">Contact</Link>
            <Link href="/privacy" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#c5a55a] transition-colors">Privacy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
