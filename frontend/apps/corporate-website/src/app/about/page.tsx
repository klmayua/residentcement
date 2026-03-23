import Link from "next/link";
import { Diamond, Users, Award, Globe, Architecture, Verified, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Diamond,
    title: "Innovation",
    description: "Pushing the boundaries of molecular structural integrity through continuous R&D.",
  },
  {
    icon: Verified,
    title: "Integrity",
    description: "Honesty in our source materials and transparency in our logistics operations.",
  },
  {
    icon: Globe,
    title: "Longevity",
    description: "Reducing global waste by ensuring structures never need replacement.",
  },
  {
    icon: Users,
    title: "Empowerment",
    description: "Creating jobs and empowering local communities through sustainable development.",
  },
];

const milestones = [
  { year: "2023", title: "Company Founded", description: "Resident Cement Company Limited registered under Corporate Affairs Commission" },
  { year: "2024", title: "Mining Licenses Acquired", description: "Secured mining licenses throughout Nigeria" },
  { year: "2024", title: "Sinoma Partnership", description: "Strategic partnership with Sinoma Nigeria Company for technology transfer" },
  { year: "2025", title: "Bauchi Plant Construction", description: "Groundbreaking of $500M cement plant in Gwana District, Alkaleri LGA" },
  { year: "2026", title: "Production Launch", description: "Commercial production begins with 10 million tonnes annual capacity" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section: Editorial Header */}
      <section className="relative px-4 sm:px-6 lg:px-8 xl:px-24 py-24 md:py-32 overflow-hidden pt-32">
        <div className="container-wide mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <span className="text-primary font-label text-sm font-bold uppercase tracking-[0.3em] mb-6 block">
              Our Identity
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-black tracking-tighter leading-[0.9] text-foreground">
              Architectural <br />
              <span className="text-primary">Excellence</span> <br />
              Defined.
            </h1>
          </div>
          <div className="lg:col-span-4 pb-4">
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed font-body">
              Forging the future of urban landscapes through the relentless pursuit of structural permanence and aesthetic purity.
            </p>
          </div>
        </div>
      </section>

      {/* The Monolith: Hero Imagery */}
      <section className="px-4 sm:px-6 lg:px-8 xl:px-24 mb-24">
        <div className="container-wide mx-auto relative h-[400px] md:h-[600px] overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-foreground/10 z-10" />
          <div className="w-full h-full bg-gradient-to-br from-cement-300 to-cement-500 flex items-center justify-center">
            <Architecture className="h-40 w-40 text-cement-700" />
          </div>
          <div className="absolute bottom-0 right-0 bg-surface-container-lowest p-8 md:p-12 max-w-md z-20 shadow-xl hidden md:block">
            <h3 className="font-headline text-2xl font-bold mb-4">Built for Generations</h3>
            <p className="text-on-surface-variant text-sm leading-loose">
              We don't just supply material; we provide the backbone of legacy. Resident Cement is engineered to outlast the century.
            </p>
          </div>
        </div>
      </section>

      {/* Heritage Section: Tonal Transition */}
      <section className="bg-surface-container-low py-24 md:py-32">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-surface-container-highest rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-cement-400 to-cement-600 flex items-center justify-center">
                  <Verified className="h-32 w-32 text-cement-800" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary p-6 flex flex-col justify-end">
                <span className="text-4xl font-headline font-black text-on-primary leading-none">
                  2025
                </span>
                <span className="text-xs uppercase font-bold text-on-primary tracking-widest mt-2">
                  Production Start
                </span>
              </div>
            </div>

            <div className="lg:pl-8">
              <span className="text-label text-primary mb-4 block">Our Heritage</span>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-8">
                Our Mission & Vision
              </h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed text-lg">
                To produce high-quality, affordable cement while contributing to Nigeria's economic development through job creation, sustainable industrial growth, and infrastructure advancement.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex gap-4 items-start">
                  <Diamond className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">Purity of Material</h4>
                    <p className="text-sm text-on-surface-variant">
                      Sourced from exclusive limestone deposits, processed with artisanal precision.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <Architecture className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">Architectural Trust</h4>
                    <p className="text-sm text-on-surface-variant">
                      The preferred choice for the world's most demanding structural engineers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-outline-variant/20">
                {[
                  { value: "$500M", label: "Investment" },
                  { value: "10M", label: "Tons/Year" },
                  { value: "100-150MW", label: "Power Plant" },
                  { value: "36", label: "States" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center md:text-left">
                    <div className="text-2xl md:text-3xl font-headline font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-label text-on-surface-variant mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission: Asymmetrical Layout */}
      <section className="section-padding overflow-hidden">
        <div className="container-wide mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16">
            <h2 className="font-headline text-4xl md:text-6xl font-black tracking-tighter mb-8 md:mb-0">
              The Mission
            </h2>
            <div className="max-w-lg md:text-right">
              <p className="text-xl font-body text-on-surface-variant italic">
                "To elevate the human experience by providing the foundation for spaces that inspire, protect, and endure."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mission Card 1 */}
            <div className="bg-surface-container p-10 flex flex-col justify-between aspect-square hover:bg-surface-container-lowest transition-all group duration-300 rounded-lg">
              <span className="text-6xl font-headline text-outline-variant group-hover:text-primary transition-colors">
                01
              </span>
              <div>
                <h3 className="text-2xl font-bold mb-4">Innovation</h3>
                <p className="text-sm text-on-surface-variant">
                  Pushing the boundaries of molecular structural integrity through R&D.
                </p>
              </div>
            </div>

            {/* Mission Card 2 (Monolith Style) */}
            <div
              className="p-10 flex flex-col justify-between aspect-square rounded-lg"
              style={{ background: "linear-gradient(45deg, #745B17, #C5A55A)" }}
            >
              <span className="text-6xl font-headline text-on-primary/30">02</span>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-on-primary">Integrity</h3>
                <p className="text-sm text-on-primary/80">
                  Honesty in our source materials and transparency in our logistics.
                </p>
              </div>
            </div>

            {/* Mission Card 3 */}
            <div className="bg-surface-container p-10 flex flex-col justify-between aspect-square hover:bg-surface-container-lowest transition-all group duration-300 rounded-lg">
              <span className="text-6xl font-headline text-outline-variant group-hover:text-primary transition-colors">
                03
              </span>
              <div>
                <h3 className="text-2xl font-bold mb-4">Longevity</h3>
                <p className="text-sm text-on-surface-variant">
                  Reducing global waste by ensuring structures never need replacement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-surface-container py-24 md:py-32">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-label text-primary mb-4 block">Our Values</span>
            <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-6">
              The Principles That Guide Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-surface-container-lowest p-8 rounded-lg hover:shadow-soft transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <value.icon className="h-6 w-6 text-primary group-hover:text-on-primary" />
                </div>
                <h3 className="font-headline text-xl font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-label text-primary mb-4 block">Our Journey</span>
            <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-6">
              Milestones
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, idx) => (
              <div key={milestone.year} className="flex gap-6 mb-10 last:mb-0 group">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border-2 border-primary/20 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    {milestone.year.slice(-2)}
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-outline-variant/30 my-2" />
                  )}
                </div>
                <div className="pb-8 flex-1">
                  <div className="text-label text-primary mb-1">{milestone.year}</div>
                  <h3 className="font-headline text-xl font-bold text-foreground mb-2">{milestone.title}</h3>
                  <p className="text-on-surface-variant">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding text-center relative overflow-hidden bg-surface-bright">
        <div className="container-narrow mx-auto relative z-10">
          <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-8 text-foreground">
            Ready to Build Your Legacy?
          </h2>
          <p className="text-on-surface-variant mb-12 text-lg">
            Partner with us for your next architectural masterwork. From conceptual drafts to final pours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact/">
              <Button size="lg" className="btn-gold px-10 py-6">
                Start Project
              </Button>
            </Link>
            <Link href="/products/">
              <Button size="lg" variant="outline" className="px-10 py-6">
                Download Catalog
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full opacity-[0.03] pointer-events-none">
          <span className="text-[30rem] font-headline font-black text-foreground select-none">RC</span>
        </div>
      </section>
    </div>
  );
}
