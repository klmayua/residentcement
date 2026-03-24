import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, TrendingUp, Building2, Users, Archive, Download, ChevronRight, Gavel, Network, BookOpen, FileText, Newspaper, Package, Search } from "lucide-react";

const sidebarLinks = [
  { href: "/investors", label: "Overview", icon: LayoutDashboard, active: true },
  { href: "/investors/performance", label: "Performance", icon: TrendingUp },
  { href: "/investors/governance", label: "Governance", icon: Building2 },
  { href: "/investors/shareholders", label: "Shareholders", icon: Users },
  { href: "/investors/archive", label: "Archive", icon: Archive },
];

const financialMetrics = [
  { label: "Revenue", value: "428.5", unit: "₦bn", change: "+18.4%" },
  { label: "EBITDA", value: "154.2", unit: "₦bn", change: "+12.1%" },
  { label: "Profit After Tax", value: "89.4", unit: "₦bn", change: "+9.7%" },
  { label: "Earnings Per Share", value: "5.24", unit: "₦", change: "+5.4%" },
];

const resources = [
  { number: "01", title: "Quarterly Results", subtitle: "Q4 2023 Performance Deck", icon: FileText },
  { number: "02", title: "AGM Archives", subtitle: "Minutes and Resolutions 2018-2023", icon: Archive },
  { number: "03", title: "Sustainability Framework", subtitle: "ESG Commitment & Impact Report", icon: Newspaper },
  { number: "04", title: "Press Kit", subtitle: "High-res assets and Brand guidelines", icon: Package },
];

export default function InvestorsPage() {
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
            <Link href="/products" className="text-[#1a1c1c] hover:text-[#745b17] transition-colors text-sm font-medium tracking-wide">Products</Link>
            <Link href="/investors" className="text-[#745b17] border-b-2 border-[#745b17] pb-1 text-sm font-medium tracking-wide">Investors</Link>
          </div>
          <button className="bg-[#745b17] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity">
            Order Now
          </button>
        </div>
      </nav>

      <div className="pt-20 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#f4f4f3] min-h-screen hidden lg:flex flex-col fixed left-0 top-20 border-r border-[#e2e2e2]/50">
          <div className="p-8">
            <h2 className="text-lg font-bold font-headline text-[#1a1c1c]">Investor Relations</h2>
            <p className="text-[0.7rem] uppercase tracking-widest text-[#7e7667] font-bold mt-1">RCEM:NGX Portal</p>
          </div>
          <nav className="flex flex-col px-4">
            {sidebarLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`flex items-center gap-4 px-4 py-4 transition-all duration-200 rounded ${link.active ? 'bg-[#eeeeed] text-[#745b17] font-bold' : 'text-[#1a1c1c]/60 hover:bg-[#eeeeed]/50'}`}>
                <link.icon className="w-5 h-5" />
                <span className="text-[0.75rem] uppercase tracking-tight">{link.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#745b17] flex items-center justify-center rounded">
                <span className="text-white font-black text-xs">RC</span>
              </div>
              <div>
                <p className="text-[0.75rem] font-bold">Resident Cement</p>
                <p className="text-[0.65rem] text-[#7e7667]">Bauchi, Nigeria</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Hero */}
          <section className="relative w-full min-h-[600px] flex flex-col justify-end p-8 lg:p-20 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image src="https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=2070&auto=format&fit=crop" alt="Industrial structure" fill className="object-cover opacity-60 grayscale" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1c] via-[#1a1c1c]/40 to-transparent" />
            </div>
            <div className="relative z-10 max-w-5xl">
              <div className="inline-flex items-center gap-2 bg-[#745b17] px-3 py-1 mb-6 rounded">
                <span className="w-2 h-2 bg-white animate-pulse rounded-full" />
                <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-white">Phase 04 : Live</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 font-headline text-white">
                Empowering <br />Bauchi&apos;s Growth.
              </h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-16 border-t border-white/20 pt-10">
                {[
                  { label: "Market Cap", value: "$1.52B" },
                  { label: "Current Stock", value: "₦42.50" },
                  { label: "Capacity", value: "6.0 MTPA" },
                  { label: "State Stake", value: "10.0%" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[0.7rem] uppercase tracking-widest text-white/50 mb-1">{stat.label}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Financial Metrics */}
          <section className="py-20 lg:py-28 px-8 lg:px-20 bg-[#f9f9f8]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="max-w-2xl">
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight font-headline mb-4 text-[#1a1c1c]">
                    Key Financial Metrics <span className="text-[#745b17]">(FY 2023)</span>
                  </h2>
                  <p className="text-[#4d4639] text-lg">Our structural resilience reflected in robust year-on-year growth.</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-wider rounded transition-all hover:opacity-90 text-white" style={{ background: 'linear-gradient(45deg, #745B17, #C5A55A)' }}>
                  Download Full Report <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-[#eeeeed]">
                {financialMetrics.map((metric) => (
                  <div key={metric.label} className="p-8 lg:p-10 bg-[#ffffff] hover:bg-[#f9f9f8] transition-colors">
                    <p className="text-[0.75rem] font-bold tracking-widest uppercase text-[#7e7667] mb-2">{metric.label}</p>
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-4xl lg:text-5xl font-bold tracking-tighter text-[#1a1c1c]">{metric.value}</span>
                      <span className="text-[#7e7667] font-headline text-xl italic">{metric.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 font-bold">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">{metric.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Resources & Reports */}
          <section className="py-20 lg:py-28 px-8 lg:px-20 bg-[#f4f4f3]">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Annual Report Feature */}
                <div className="bg-[#1a1c1c] text-white p-10 lg:p-16 flex flex-col justify-between group cursor-pointer rounded">
                  <div>
                    <div className="flex justify-between items-start mb-12">
                      <BookOpen className="w-12 h-12 text-[#c5a55a]" />
                      <span className="text-[0.7rem] tracking-[0.3em] font-bold uppercase opacity-50">Document Archive</span>
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-bold tracking-tight font-headline mb-6">2023 Annual <br />Report</h3>
                    <p className="text-white/60 text-lg max-w-sm mb-12">An in-depth look at our operational milestones and strategic roadmap.</p>
                  </div>
                  <button className="w-full py-5 text-[0.8rem] font-bold uppercase tracking-widest bg-[#c5a55a] text-[#1a1c1c] group-hover:bg-white transition-colors duration-300 rounded">
                    Download PDF (42MB)
                  </button>
                </div>

                {/* Resources List */}
                <div className="grid grid-cols-1 gap-1">
                  {resources.map((resource) => (
                    <div key={resource.number} className="bg-[#ffffff] p-6 lg:p-8 flex justify-between items-center group hover:bg-[#eeeeed] transition-colors cursor-pointer rounded">
                      <div className="flex items-center gap-6">
                        <span className="text-3xl font-light text-[#1a1c1c]/20">{resource.number}</span>
                        <div>
                          <h4 className="text-lg lg:text-xl font-bold text-[#1a1c1c]">{resource.title}</h4>
                          <p className="text-sm text-[#7e7667]">{resource.subtitle}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#7e7667] group-hover:text-[#745b17] transition-colors" />
                    </div>
                  ))}
                  <button className="mt-8 text-[#745b17] font-bold text-[0.75rem] uppercase tracking-widest underline decoration-2 underline-offset-8 hover:opacity-80 transition-opacity">
                    Explore Full Archive
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quote Section */}
          <section className="h-[400px] lg:h-[512px] w-full relative overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1611974789855-9c2a0a9a8488?q=80&w=2070&auto=format&fit=crop" alt="Financial charts" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#1a1c1c]/60 flex items-center justify-center p-6 lg:p-10">
              <div className="max-w-4xl text-center">
                <p className="text-white text-2xl md:text-4xl lg:text-5xl font-headline italic leading-snug">
                  &quot;Precision in production, transparency in performance. We are building the foundations of a new industrial era.&quot;
                </p>
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
              <Link href="/privacy" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17] transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17] transition-colors">Terms</Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
