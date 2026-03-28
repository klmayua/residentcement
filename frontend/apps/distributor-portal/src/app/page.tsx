import Link from 'next/link';
import Image from 'next/image';

const benefits = [
  {
    icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
    label: 'Factory-Direct Supply',
    description: 'Source directly from our Bauchi plant. No intermediaries, guaranteed quality.',
  },
  {
    icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
    label: 'Competitive Margins',
    description: 'Tiered pricing that rewards volume; your margins scale with your growth.',
  },
  {
    icon: 'M1 3h15v13H1z M16 8l4 0 3 3 0 5-7 0-7-8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
    label: 'Reliable Logistics',
    description: 'Coordinated nationwide delivery with real-time shipment tracking.',
  },
  {
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    label: 'Dedicated Support',
    description: 'Your own account manager plus 24/7 portal access.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#161311] text-[#e9e1dd]">

      {/*  Navigation  */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#161311]/80 backdrop-blur-xl border-b border-[#292524]/40 h-14 flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="h-10 w-40" style={{ background: '#e5c374', WebkitMaskImage: "url('/images/logo.png')", maskImage: "url('/images/logo.png')", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "left center", maskPosition: "left center" }} role="img" aria-label="Resident Ciment" />
          <div className="flex items-center gap-5">
            <Link href="/apply" className="text-[10px] font-bold uppercase tracking-widest text-[#7e7667] hover:text-[#e9e1dd] transition-colors">
              Apply
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-[#161311] hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/*  Hero  */}
      <section className="relative min-h-[380px] h-[65vh] flex items-end">
        {/* Background photograph */}
        <Image
          src="/images/hero-bg.webp"
          alt="Resident Ciment Plant"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/60 to-[#161311]/20" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pb-10">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.35em] text-[#e5c374] mb-4 border border-[#e5c374]/30 px-3 py-1">
            Authorised Dealer Programme
          </span>
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
            Nigeria&apos;s Premier<br />Cement, Direct to You
          </h1>
          <p className="text-[#a8a29e] text-base max-w-lg mb-8 leading-relaxed">
            Join an exclusive network of authorised distributors. Factory-direct supply,
            competitive margins, and a dedicated digital portal - all in one partnership.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#161311] hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)', boxShadow: '0 4px 20px rgba(229,195,116,0.2)' }}
            >
              Apply for Dealership
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a8a29e] border border-[#4d4540] hover:border-[#7e7667] hover:text-[#e9e1dd] transition-all"
            >
              Existing Partner Sign In
            </Link>
          </div>
        </div>
      </section>

      {/*  Stats Bar  */}
      <div className="border-t border-b border-[#292524]/40 bg-[#1c1917]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#292524]/40">
            {[
              { value: '10M', label: 'Tonnes / Year' },
              { value: '42.5R', label: 'Strength Class' },
              { value: 'EN197', label: 'Certified' },
              { value: '36+', label: 'States Covered' },
            ].map((s) => (
              <div key={s.label} className="py-5 px-6 text-center">
                <div className="text-2xl font-headline font-bold text-[#e5c374]">{s.value}</div>
                <div className="text-[9px] uppercase tracking-widest text-[#57534e] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*  Benefits  */}
      <section className="py-10 md:py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-7">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#e5c374] mb-2 block">Why Partner With Us</span>
              <h2 className="font-headline text-3xl font-bold tracking-tight">Built for Serious Distributors</h2>
            </div>
            <Link href="/apply" className="text-[10px] font-bold uppercase tracking-widest text-[#e5c374] border-b border-[#e5c374]/30 pb-0.5 hover:border-[#e5c374] transition-all hidden md:inline whitespace-nowrap">
              Start Application ->
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#292524]/30">
            {benefits.map((b) => (
              <div key={b.label} className="bg-[#161311] p-7 group hover:bg-[#1c1917] transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  className="text-[#e5c374]/50 group-hover:text-[#e5c374] transition-colors mb-5">
                  {b.icon.split(' ').map((d, i) => <path key={i} d={d} />)}
                </svg>
                <h3 className="font-headline text-base font-semibold mb-2">{b.label}</h3>
                <p className="text-[#57534e] text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  Split  photo + process  */}
      <section className="py-10 md:py-12 px-6 bg-[#1c1917]/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          {/* Photo */}
          <div className="relative h-64 lg:h-auto min-h-[320px]">
            <Image
              src="/images/facility.webp"
              alt="Gwana Manufacturing Plant"
              fill
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1c1917]/60 hidden lg:block" />
            <div className="absolute bottom-0 left-0 p-7">
              <p className="text-[10px] uppercase tracking-widest text-[#e5c374] mb-1">Manufactured at</p>
              <p className="font-headline text-base font-semibold">Gwana, Alkaleri LGA, Bauchi State</p>
              <p className="text-[10px] text-[#7e7667] mt-1">Technology Partner: Sinoma International</p>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-[#221f1d] p-10 flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#e5c374] mb-2 block">Process</span>
            <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">Three Steps to Partnership</h2>
            <div className="space-y-8">
              {[
                { n: '01', title: 'Submit Application', body: 'Complete our business application with company details and distribution capacity.' },
                { n: '02', title: 'Review & Approval', body: 'Our partnerships team reviews within 3-5 business days and contacts you directly.' },
                { n: '03', title: 'Portal Activation', body: 'Receive credentials, pricing schedule, and start placing orders immediately.' },
              ].map((s) => (
                <div key={s.n} className="flex gap-5">
                  <span className="text-3xl font-headline font-black text-[#e5c374]/15 leading-none w-10 flex-shrink-0 select-none">{s.n}</span>
                  <div>
                    <p className="font-semibold text-[#e9e1dd] text-sm mb-1">{s.title}</p>
                    <p className="text-[#57534e] text-sm leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/apply"
              className="mt-10 inline-flex items-center gap-2 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#161311] hover:opacity-90 transition-opacity self-start"
              style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}
            >
              Begin Application
            </Link>
          </div>
        </div>
      </section>

      {/*  CTA  */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="relative overflow-hidden px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{ background: 'linear-gradient(135deg, #1c1917 0%, #221f1d 100%)' }}
          >
            <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 50%, #e5c374 0%, transparent 70%)' }} />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#e5c374] mb-2">Limited Dealerships Available</p>
              <h2 className="font-headline text-3xl font-bold tracking-tight">Ready to Build Your Distribution Business?</h2>
              <p className="text-[#7e7667] text-sm mt-2">Dealerships are allocated by region. Apply today to secure your territory.</p>
            </div>
            <div className="relative flex-shrink-0 flex gap-3">
              <Link
                href="/apply"
                className="px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest text-[#161311] hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)', boxShadow: '0 4px 20px rgba(229,195,116,0.2)' }}
              >
                Apply Now
              </Link>
              <Link
                href="/login"
                className="px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest text-[#a8a29e] border border-[#292524] hover:border-[#4d4540] hover:text-[#e9e1dd] transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*  Footer  */}
      <footer className="border-t border-[#292524]/40 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="h-9 w-36 opacity-40" style={{ background: '#e5c374', WebkitMaskImage: "url('/images/logo.png')", maskImage: "url('/images/logo.png')", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "left center", maskPosition: "left center" }} role="img" aria-label="Resident Ciment" />
          <div className="flex gap-6">
            <Link href="/apply" className="text-[10px] uppercase tracking-widest text-[#4d4540] hover:text-[#7e7667] transition-colors">Apply</Link>
            <Link href="/login" className="text-[10px] uppercase tracking-widest text-[#4d4540] hover:text-[#7e7667] transition-colors">Sign In</Link>
            <a href="https://residentcement.nyamabo.com/contact" className="text-[10px] uppercase tracking-widest text-[#4d4540] hover:text-[#7e7667] transition-colors">Contact</a>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-[#4d4540]">&copy; {new Date().getFullYear()} Resident Ciment Bauchi Ltd</p>
        </div>
      </footer>
    </div>
  );
}
