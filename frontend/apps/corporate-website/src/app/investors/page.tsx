import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  Users,
  Archive,
  Download,
  ChevronRight,
  Gavel,
  Network,
  BookOpen,
  FileText,
  Newspaper,
  Package,
} from "lucide-react";

const sidebarLinks = [
  { href: "/investors", label: "Overview", icon: LayoutDashboard, active: true },
  { href: "/investors/performance", label: "Performance", icon: TrendingUp },
  { href: "/investors/governance", label: "Governance", icon: Building2 },
  { href: "/investors/shareholders", label: "Shareholders", icon: Users },
  { href: "/investors/archive", label: "Archive", icon: Archive },
];

const financialMetrics = [
  {
    label: "Revenue",
    value: "428.5",
    unit: "₦bn",
    change: "+18.4%",
    trend: "up",
  },
  {
    label: "EBITDA",
    value: "154.2",
    unit: "₦bn",
    change: "+12.1%",
    trend: "up",
  },
  {
    label: "Profit After Tax",
    value: "89.4",
    unit: "₦bn",
    change: "+9.7%",
    trend: "up",
  },
  {
    label: "Earnings Per Share",
    value: "5.24",
    unit: "₦",
    change: "+5.4%",
    trend: "up",
  },
];

const resources = [
  {
    number: "01",
    title: "Quarterly Results",
    subtitle: "Q4 2023 Performance Deck",
    icon: FileText,
  },
  {
    number: "02",
    title: "AGM Archives",
    subtitle: "Minutes and Resolutions 2018-2023",
    icon: Archive,
  },
  {
    number: "03",
    title: "Sustainability Framework",
    subtitle: "ESG Commitment & Impact Report",
    icon: Newspaper,
  },
  {
    number: "04",
    title: "Press Kit",
    subtitle: "High-res assets and Brand guidelines",
    icon: Package,
  },
];

export default function InvestorsPage() {
  return (
    <main className="min-h-screen">
      {/* Side Navigation - Hidden on Mobile */}
      <aside className="fixed left-0 top-0 h-full flex-col pt-24 bg-surface-container-low w-64 hidden lg:flex z-40 border-r border-outline-variant/10">
        <div className="px-8 mb-10">
          <h2 className="text-lg font-bold font-headline text-primary">Investor Relations</h2>
          <p className="text-[0.7rem] uppercase tracking-widest text-on-surface/50 font-bold">RCEM:NGX Portal</p>
        </div>
        <nav className="flex flex-col">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-4 px-8 py-4 transition-all duration-200 ${
                link.active
                  ? "bg-surface-container text-primary font-bold"
                  : "text-on-surface/60 hover:bg-surface-container-low"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[0.75rem] uppercase tracking-tight">{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
              <span className="text-white font-black text-xs">RC</span>
            </div>
            <div>
              <p className="text-[0.75rem] font-bold">Resident Cement</p>
              <p className="text-[0.65rem] text-on-surface/50">Bauchi, Nigeria</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Hero Section */}
        <section className="relative w-full min-h-[716px] flex flex-col justify-end p-6 sm:p-8 lg:p-20 overflow-hidden bg-primary text-white">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=2070&auto=format&fit=crop"
              alt="Monolithic industrial concrete structure"
              fill
              className="object-cover opacity-60 grayscale"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-5xl">
            <div className="inline-flex items-center gap-2 bg-secondary px-3 py-1 mb-6">
              <span className="w-2 h-2 bg-white animate-pulse" />
              <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-white">Phase 04 : Live</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 font-headline">
              Empowering <br />Bauchi&apos;s Growth.
            </h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-16 border-t border-white/20 pt-10">
              <div>
                <p className="text-[0.7rem] uppercase tracking-widest text-white/50 mb-1">Market Cap</p>
                <p className="text-2xl lg:text-3xl font-bold">$1.52B</p>
              </div>
              <div>
                <p className="text-[0.7rem] uppercase tracking-widest text-white/50 mb-1">Current Stock</p>
                <p className="text-2xl lg:text-3xl font-bold">₦42.50</p>
              </div>
              <div>
                <p className="text-[0.7rem] uppercase tracking-widest text-white/50 mb-1">Capacity</p>
                <p className="text-2xl lg:text-3xl font-bold">6.0 MTPA</p>
              </div>
              <div>
                <p className="text-[0.7rem] uppercase tracking-widest text-white/50 mb-1">State Stake</p>
                <p className="text-2xl lg:text-3xl font-bold">10.0%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Financial Metrics Section */}
        <section className="section-padding bg-surface">
          <div className="container-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight font-headline mb-4">
                  Key Financial Metrics <span className="text-secondary">(FY 2023)</span>
                </h2>
                <p className="text-on-surface/60 text-lg">
                  Our structural resilience reflected in robust year-on-year growth and operational efficiency.
                </p>
              </div>
              <button className="btn-secondary inline-flex items-center gap-3">
                Download Full Report <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-surface-container">
              {financialMetrics.map((metric) => (
                <div key={metric.label} className="p-8 lg:p-10 bg-surface-container-lowest">
                  <p className="text-[0.75rem] font-bold tracking-widest uppercase text-on-surface/50 mb-2">{metric.label}</p>
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-4xl lg:text-5xl font-bold tracking-tighter">{metric.value}</span>
                    <span className="text-on-surface/40 font-headline text-xl italic">{metric.unit}</span>
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

        {/* Resources & Reports Section */}
        <section className="section-padding bg-surface-container-low">
          <div className="container-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left: Big Feature - Annual Report */}
              <div className="bg-primary text-white p-10 lg:p-16 h-full flex flex-col justify-between group cursor-pointer">
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <BookOpen className="w-12 h-12 text-secondary" />
                    <span className="text-[0.7rem] tracking-[0.3em] font-bold uppercase opacity-50">Document Archive</span>
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-bold tracking-tight font-headline mb-6">2023 Annual <br />Report</h3>
                  <p className="text-white/60 text-lg max-w-sm mb-12">
                    An in-depth look at our operational milestones, financial health, and strategic roadmap for the coming decade.
                  </p>
                </div>
                <button className="w-full bg-secondary py-5 text-[0.8rem] font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-primary transition-colors duration-300">
                  Download PDF (42MB)
                </button>
              </div>

              {/* Right: Resources List */}
              <div className="grid grid-cols-1 gap-1">
                {resources.map((resource) => (
                  <div
                    key={resource.number}
                    className="bg-surface-container-lowest p-6 lg:p-8 flex justify-between items-center group hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-3xl font-light text-on-surface/20">{resource.number}</span>
                      <div>
                        <h4 className="text-lg lg:text-xl font-bold">{resource.title}</h4>
                        <p className="text-sm text-on-surface/50">{resource.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-on-surface/40 group-hover:text-secondary transition-colors" />
                  </div>
                ))}
                <button className="mt-8 text-secondary font-bold text-[0.75rem] uppercase tracking-widest underline decoration-2 underline-offset-8 self-start hover:text-secondary/80 transition-colors">
                  Explore Full Archive
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Industrial Visual Anchor */}
        <section className="h-[400px] lg:h-[512px] w-full relative overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a9a8488?q=80&w=2070&auto=format&fit=crop"
            alt="Financial charts and industrial tools"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/60 flex items-center justify-center p-6 lg:p-10">
            <div className="max-w-4xl text-center">
              <p className="text-white text-2xl md:text-4xl lg:text-5xl font-headline italic leading-snug">
                &quot;Precision in production, transparency in performance. We are building the foundations of a new industrial era.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* Governance & Services Section */}
        <section className="section-padding bg-surface">
          <div className="container-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Left: Governance */}
              <div className="space-y-12">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold font-headline">Corporate Governance</h2>
                  <div className="h-1 w-20 bg-secondary" />
                </div>
                <div className="space-y-8">
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-surface-container flex-shrink-0 flex items-center justify-center">
                      <Gavel className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="text-lg font-bold mb-2">Board Charter</h5>
                      <p className="text-on-surface/60 text-sm mb-4">The formal framework of authorities and responsibilities of the Board.</p>
                      <Link href="#" className="text-secondary font-bold text-[0.7rem] uppercase tracking-widest hover:underline">
                        Download PDF
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-surface-container flex-shrink-0 flex items-center justify-center">
                      <Network className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="text-lg font-bold mb-2">Committee Structures</h5>
                      <p className="text-on-surface/60 text-sm mb-4">Oversight details for Audit, Risk, and Compensation committees.</p>
                      <Link href="#" className="text-secondary font-bold text-[0.7rem] uppercase tracking-widest hover:underline">
                        View Hierarchy
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Shareholder Services */}
              <div className="bg-surface-container-high p-8 lg:p-12 space-y-10">
                <h2 className="text-3xl font-bold font-headline">Shareholder Services</h2>
                <div className="space-y-6">
                  <div className="bg-surface p-6">
                    <h5 className="font-bold mb-2">E-Dividend Enrollment</h5>
                    <p className="text-sm text-on-surface/50 mb-6">Automate your dividend payments directly to your preferred bank account.</p>
                    <button className="btn-primary w-full text-center justify-center">Enroll Now</button>
                  </div>
                  <div className="bg-surface p-6">
                    <h5 className="font-bold mb-2">Contact Registrar</h5>
                    <p className="text-sm text-on-surface/50 mb-6">Need assistance with your shares? Connect with our dedicated registrar team.</p>
                    <button className="btn-outline w-full text-center justify-center border-primary text-primary hover:bg-primary hover:text-white">
                      Contact Registrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
