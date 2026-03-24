import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Factory, LocalShipping, Architecture, AccountBalance, ArrowForward } from "lucide-react";

const jobOpenings = [
  {
    title: "Chief Mechanical Engineer",
    department: "Operations",
    type: "Full-Time",
    location: "Gwana Plant, Bauchi State",
    posted: "2 days ago",
  },
  {
    title: "Process Plant Operator",
    department: "Engineering",
    type: "Shift-Based",
    location: "Gwana Plant, Bauchi State",
    posted: "5 days ago",
  },
  {
    title: "Fleet Manager (3000 Trucks)",
    department: "Logistics",
    type: "Leadership",
    location: "Central Hub, Gwana",
    posted: "1 week ago",
  },
  {
    title: "Environmental Sustainability Lead",
    department: "Sustainability",
    type: "Specialist",
    location: "Corporate HQ / Gwana",
    posted: "3 days ago",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[921px] flex items-center overflow-hidden bg-primary">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
            alt="Construction site at dusk with cranes and heavy machinery"
            fill
            className="object-cover grayscale brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-full px-6 sm:px-8 lg:px-12 xl:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 pt-32">
          <div className="lg:col-span-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-extrabold text-white leading-[0.9] tracking-tighter mb-8">
              Build the Future of <br />
              <span className="italic text-secondary">Nigerian Infrastructure</span>
            </h1>
            <p className="text-stone-300 text-lg md:text-xl max-w-2xl font-light mb-12">
              Join a $1.5B greenfield project and be part of the industrial frontier in Bauchi State.
              We are not just making cement; we are engineering permanence.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                href="#positions"
                className="btn-secondary inline-flex items-center gap-2"
              >
                View Open Roles
              </Link>
              <Link
                href="#culture"
                className="border border-white/20 backdrop-blur-sm text-white px-10 py-5 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
              >
                Our Culture
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us: The Resident Proposition */}
      <section className="section-padding bg-white">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <label className="block text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-6">
                The Resident Proposition
              </label>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold text-primary leading-tight">
                Architects of Scale.
              </h2>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-200">
              <div className="bg-white p-12 md:p-16">
                <span className="text-stone-300 text-6xl font-headline italic mb-8 block">01</span>
                <h3 className="text-2xl font-headline font-bold mb-6">Impact at Scale</h3>
                <p className="text-on-surface-variant leading-relaxed mb-8">
                  Contribute to the development of a 10Mt annual capacity plant. Your work directly
                  fuels the bridges, roads, and homes of a growing nation.
                </p>
                <span className="inline-block h-1 w-12 bg-secondary" />
              </div>
              <div className="bg-white p-12 md:p-16">
                <span className="text-stone-300 text-6xl font-headline italic mb-8 block">02</span>
                <h3 className="text-2xl font-headline font-bold mb-6">Local Empowerment</h3>
                <p className="text-on-surface-variant leading-relaxed mb-8">
                  Committed to creating 3,000+ local jobs in Bauchi State. We invest in regional
                  talent, turning local potential into industrial mastery.
                </p>
                <span className="inline-block h-1 w-12 bg-secondary" />
              </div>
              <div className="bg-white p-12 md:p-16">
                <span className="text-stone-300 text-6xl font-headline italic mb-8 block">03</span>
                <h3 className="text-2xl font-headline font-bold mb-6">Industrial Excellence</h3>
                <p className="text-on-surface-variant leading-relaxed mb-8">
                  Work alongside global leaders like Sinoma. We pair top-tier engineering with
                  cutting-edge green technology for a sustainable legacy.
                </p>
                <span className="inline-block h-1 w-12 bg-secondary" />
              </div>
              <div className="bg-primary p-12 md:p-16 flex flex-col justify-end">
                <p className="text-white text-xl font-headline italic leading-relaxed">
                  &ldquo;We don&apos;t just fill roles; we build the people who build the world.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Categories: Bento Grid */}
      <section className="section-padding bg-surface-container-low">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-primary mb-6">
              Find Your Domain
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Explore career paths across our integrated industrial ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            {/* Engineering */}
            <div className="md:col-span-4 group relative overflow-hidden h-[400px] bg-black">
              <Image
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop"
                alt="Mechanical engineering"
                fill
                className="object-cover opacity-60 grayscale group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-12 left-12">
                <h3 className="text-3xl font-headline text-white font-bold mb-4">
                  Engineering & Operations
                </h3>
                <p className="text-stone-300 max-w-sm mb-6">
                  The heartbeat of the 10Mt plant. Precision, safety, and operational mastery.
                </p>
                <Link
                  href="#"
                  className="text-secondary uppercase font-bold tracking-widest text-xs flex items-center gap-2 group-hover:gap-4 transition-all"
                >
                  Explore Roles <ArrowForward className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Logistics */}
            <div className="md:col-span-2 group relative overflow-hidden h-[400px] bg-secondary">
              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <LocalShipping className="w-12 h-12 text-white mb-6" />
                <h3 className="text-3xl font-headline text-white font-bold mb-4">
                  Logistics & Supply Chain
                </h3>
                <p className="text-stone-200 mb-6">
                  Managing a fleet of 3,000+ trucks and the pulse of Nigerian distribution.
                </p>
                <Link
                  href="#"
                  className="text-white border-b-2 border-white/30 uppercase font-bold tracking-widest text-xs inline-block pb-1"
                >
                  View Positions
                </Link>
              </div>
            </div>

            {/* Corporate */}
            <div className="md:col-span-6 group relative overflow-hidden h-[300px] bg-surface-container-highest flex items-center px-12">
              <div className="max-w-2xl">
                <h3 className="text-3xl font-headline text-primary font-bold mb-4">
                  Corporate & Governance
                </h3>
                <p className="text-on-surface-variant mb-6">
                  Strategic leadership, financial stewardship, and legal excellence guiding our $1.5B investment.
                </p>
                <Link
                  href="#"
                  className="text-primary border-b-2 border-primary uppercase font-bold tracking-widest text-xs inline-block pb-1"
                >
                  View Corporate Careers
                </Link>
              </div>
              <div className="hidden md:block absolute right-24 opacity-10">
                <AccountBalance className="w-48 h-48" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resident Culture */}
      <section className="section-padding bg-white overflow-hidden" id="culture">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                  alt="Team collaboration"
                  width={800}
                  height={600}
                  className="w-full h-[600px] object-cover grayscale"
                />
                <div className="absolute -bottom-10 -right-10 bg-secondary p-12 hidden md:block">
                  <p className="text-white font-headline text-4xl font-bold leading-tight">
                    Permanence <br />through <br />People.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <label className="block text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-6">
                Resident Culture
              </label>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold text-primary mb-10">
                Building People for Permanence
              </h2>
              <div className="space-y-8 text-on-surface-variant text-lg leading-relaxed">
                <p>
                  At Resident Cement, we believe that structural integrity begins with human integrity.
                  Our commitment to the Gwana community in Alkaleri LGA goes beyond employment—it is a
                  partnership for progress.
                </p>
                <p>
                  We offer rigorous training programs designed to transition local talent into industrial
                  leaders. Whether you are an engineer or a community liaison, you are part of a culture
                  that values safety, sustainability, and long-term legacy.
                </p>
                <div className="pt-8 grid grid-cols-2 gap-8 border-t border-stone-100">
                  <div>
                    <h4 className="text-primary font-bold mb-2">3k+ Jobs</h4>
                    <p className="text-sm">Regional employment commitment in Bauchi State.</p>
                  </div>
                  <div>
                    <h4 className="text-primary font-bold mb-2">Skill Transfer</h4>
                    <p className="text-sm">Structured mentorship with global engineering partners.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding bg-surface" id="positions">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-primary mb-6">
                Current Opportunities
              </h2>
              <p className="text-on-surface-variant">
                Your journey toward industrial impact starts here.
              </p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search roles..."
                className="w-full sm:w-80 bg-white border-none focus:ring-1 focus:ring-secondary py-4 px-6 text-sm"
              />
              <select className="bg-white border-none focus:ring-1 focus:ring-secondary py-4 px-6 text-sm">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Logistics</option>
                <option>Corporate</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {jobOpenings.map((job) => (
              <div
                key={job.title}
                className="group bg-white p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-primary transition-colors duration-500 cursor-pointer"
              >
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="bg-secondary/10 text-secondary text-[10px] uppercase font-bold tracking-widest px-2 py-1 group-hover:bg-white/10 group-hover:text-white transition-colors">
                      {job.department}
                    </span>
                    <span className="text-stone-400 text-xs uppercase font-medium group-hover:text-stone-400">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-primary group-hover:text-white transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm mt-2 group-hover:text-stone-300">
                    {job.location}
                  </p>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <span className="text-stone-400 text-xs hidden lg:block group-hover:text-stone-500">
                    Posted {job.posted}
                  </span>
                  <ArrowForward className="w-6 h-6 text-secondary group-hover:text-white group-hover:translate-x-4 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <button className="btn-primary">
              Load More Roles
            </button>
          </div>
        </div>
      </section>

      {/* Talent Community */}
      <section className="section-padding bg-primary text-white">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-8">
            Don&apos;t See Your Fit?
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto mb-16 text-lg">
            We are always looking for visionary engineers, logistics experts, and community leaders.
            Join our talent pool to be notified when the right role opens up.
          </p>
          <div className="max-w-xl mx-auto p-12 bg-white/5 border border-white/10">
            <h3 className="text-2xl font-headline font-bold mb-8">Join the Talent Pool</h3>
            <form className="space-y-6 text-left">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary focus:ring-0 transition-colors py-2 text-white placeholder-stone-700"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary focus:ring-0 transition-colors py-2 text-white placeholder-stone-700"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">
                  Area of Interest
                </label>
                <select className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary focus:ring-0 transition-colors py-2 text-white">
                  <option value="" className="bg-black">Select an area</option>
                  <option value="engineering" className="bg-black">Engineering</option>
                  <option value="supply-chain" className="bg-black">Supply Chain</option>
                  <option value="governance" className="bg-black">Governance</option>
                  <option value="sustainability" className="bg-black">Sustainability</option>
                </select>
              </div>
              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full bg-secondary text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:brightness-110 transition-all"
                >
                  Upload CV & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
