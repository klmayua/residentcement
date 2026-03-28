import Link from "next/link";

export default function CookiesPage() {
  return (
    <main className="bg-stone-950 text-white">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[320px] flex items-end pt-20 bg-stone-900">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900 to-stone-900" />
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
            Legal
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-2">
            Cookie Policy
          </h1>
          <p className="text-stone-500 text-sm">Last updated: December 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 lg:px-10">
        <div className="max-w-[800px] mx-auto space-y-10">
          <div>
            <h2 className="font-serif text-xl font-semibold mb-3">What Are Cookies</h2>
            <p className="text-stone-400 leading-relaxed text-[15px]">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold mb-3">How We Use Cookies</h2>
            <p className="text-stone-400 leading-relaxed text-[15px] mb-4">
              Resident Ciment uses cookies for the following purposes:
            </p>
            <ul className="text-stone-400 text-[15px] leading-relaxed space-y-2 list-disc list-inside">
              <li><strong className="text-stone-300">Essential cookies:</strong> Required for the operation of our website</li>
              <li><strong className="text-stone-300">Analytical cookies:</strong> Allow us to recognise and count visitors</li>
              <li><strong className="text-stone-300">Functionality cookies:</strong> Used to recognise you when you return</li>
              <li><strong className="text-stone-300">Targeting cookies:</strong> Record your visit to our website and pages visited</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold mb-3">Managing Cookies</h2>
            <p className="text-stone-400 leading-relaxed text-[15px]">
              Most web browsers allow some control of cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit{" "}
              <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary-container transition-colors">
                www.allaboutcookies.org
              </a>.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold mb-3">Contact Us</h2>
            <p className="text-stone-400 leading-relaxed text-[15px]">
              If you have any questions about our Cookie Policy, please contact us at{" "}
              <a href="mailto:info@residentcement.com" className="text-secondary hover:text-secondary-container transition-colors">
                info@residentcement.com
              </a>.
            </p>
          </div>

          <div className="pt-8 border-t border-white/5">
            <Link href="/" className="text-secondary text-sm hover:text-secondary-container transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

