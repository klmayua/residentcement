import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Download, ExternalLink } from "lucide-react";

const newsArticles = [
  {
    date: "12 Oct 2024",
    category: "Industry",
    title: "Strengthening the Supply Chain: New Terminal at Apapa Port",
    excerpt:
      "The logistical expansion marks a pivotal turn in our ability to serve the coastal regions with unprecedented speed and efficiency...",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abb51?q=80&w=1000&auto=format&fit=crop",
  },
  {
    date: "04 Oct 2024",
    category: "ESG",
    title: "Decarbonization Roadmap: The Path to Net Zero Cement",
    excerpt:
      "Our engineers have successfully piloted a low-clinker formulation that reduces carbon intensity by 22% while maintaining PSI strength...",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    date: "28 Sep 2024",
    category: "Operations",
    title: "Bauchi Plant Reaches 95% Operational Capacity",
    excerpt:
      "The flagship facility has exceeded production targets for the third consecutive quarter, solidifying its position as a regional hub...",
    image: "https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=1000&auto=format&fit=crop",
  },
];

const pressReleases = [
  { date: "15 Oct 2024", title: "Q3 2024 Financial Results Announcement" },
  { date: "02 Oct 2024", title: "Partnership Agreement with Sinoma Nigeria" },
  { date: "18 Sep 2024", title: "New Kiln Installation Complete at Gwana Plant" },
  { date: "05 Sep 2024", title: "Resident Cement Wins Sustainability Award" },
];

export default function MediaPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"
            alt="Media center"
            fill
            className="object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 container-full px-6 sm:px-8 lg:px-12 xl:px-16 pt-24">
          <span className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-6 block">
            Media Centre
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-extrabold text-white leading-[0.9] tracking-tighter mb-8 max-w-4xl">
            The Resident Narrative
          </h1>
          <p className="text-stone-300 text-lg md:text-xl max-w-2xl font-light">
            Press releases, media kits, and the latest updates from Nigeria&apos;s emerging industrial giant.
          </p>
        </div>
      </section>

      {/* Featured Video */}
      <section className="section-padding bg-surface">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-16">
            <span className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4 block">
              Featured
            </span>
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Corporate Documentary</h2>
          </div>

          <div className="relative aspect-video bg-primary group cursor-pointer overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=2070&auto=format&fit=crop"
              alt="Documentary thumbnail"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-white ml-1" fill="white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-2xl font-headline text-white font-bold">Building the Future: The Resident Cement Story</h3>
              <p className="text-stone-400 text-sm mt-2">Documentary • 12 min</p>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="section-padding bg-surface-container-low">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4 block">
                Latest News
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold">Press & Updates</h2>
            </div>
            <Link
              href="#"
              className="btn-tertiary inline-flex items-center gap-2"
            >
              View All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsArticles.map((article) => (
              <article
                key={article.title}
                className="group bg-white cursor-pointer"
              >
                <div className="relative h-[300px] overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-stone-400 text-xs uppercase">{article.date}</span>
                    <span className="text-secondary text-xs font-bold uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-4 group-hover:text-secondary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-stone-600 text-sm line-clamp-2">{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="section-padding bg-white">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <span className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4 block">
                Press Releases
              </span>
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-12">Official Statements</h2>

              <div className="space-y-0">
                {pressReleases.map((release, index) => (
                  <div
                    key={release.title}
                    className="group flex items-start gap-6 py-6 border-b border-stone-200 cursor-pointer hover:bg-surface-container-low transition-colors px-4 -mx-4"
                  >
                    <span className="text-stone-300 text-2xl font-headline">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <p className="text-stone-400 text-xs uppercase mb-1">{release.date}</p>
                      <h4 className="font-headline font-bold group-hover:text-secondary transition-colors">
                        {release.title}
                      </h4>
                    </div>
                    <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-secondary group-hover:translate-x-2 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary text-white p-12 flex flex-col justify-between">
              <div>
                <span className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4 block">
                  Media Kit
                </span>
                <h3 className="text-3xl font-headline font-bold mb-6">Download Resources</h3>
                <p className="text-stone-400 mb-8">
                  Access high-resolution images, logos, executive bios, and corporate fact sheets for media use.
                </p>
              </div>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 transition-colors">
                  <span className="flex items-center gap-3">
                    <Download className="w-5 h-5" />
                    Brand Guidelines (PDF)
                  </span>
                  <span className="text-stone-400 text-sm">2.4 MB</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 transition-colors">
                  <span className="flex items-center gap-3">
                    <Download className="w-5 h-5" />
                    Media Assets (ZIP)
                  </span>
                  <span className="text-stone-400 text-sm">156 MB</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 transition-colors">
                  <span className="flex items-center gap-3">
                    <Download className="w-5 h-5" />
                    Fact Sheet (PDF)
                  </span>
                  <span className="text-stone-400 text-sm">892 KB</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Media Team */}
      <section className="section-padding bg-surface-container-low">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="bg-secondary text-white p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl font-headline font-bold mb-2">Media Inquiries</h3>
              <p className="text-stone-200">Contact our communications team for interviews, press visits, or additional information.</p>
            </div>
            <Link
              href="mailto:media@residentcement.com"
              className="bg-white text-secondary px-10 py-5 font-bold uppercase tracking-widest text-xs hover:bg-stone-100 transition-colors whitespace-nowrap"
            >
              Contact PR Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
