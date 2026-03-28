export default function ContactPage() {
  return (
    <main className="bg-stone-950 text-white">

      {/* ── Full-bleed split hero + form ── */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* Left — dark panel with heading + contact details */}
        <div className="bg-stone-900 flex flex-col pt-20 pb-12 px-8 lg:px-14">
          <div className="mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Get In Touch
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Contact Us
            </h1>
            <p className="text-stone-400 text-base max-w-md leading-relaxed">
              Reach our team for partnership discussions, dealer enquiries, or general information.
            </p>
          </div>

          {/* Contact details — 2×2 grid */}
          <div className="grid grid-cols-2 gap-px bg-white/5 mb-8">
            <div className="bg-stone-900 p-5">
              <span className="material-symbols-outlined text-secondary text-xl mb-3 block">location_on</span>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-400 mb-1">Head Office</h3>
              <p className="text-white text-sm leading-relaxed">
                No. 38 Mike Akhigbe Way<br />
                Jabi, Abuja, Nigeria
              </p>
            </div>
            <div className="bg-stone-900 p-5">
              <span className="material-symbols-outlined text-secondary text-xl mb-3 block">factory</span>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-400 mb-1">Plant Location</h3>
              <p className="text-white text-sm leading-relaxed">
                Gwana District, Alkaleri LGA<br />
                Bauchi State, Nigeria
              </p>
            </div>
            <div className="bg-stone-900 p-5">
              <span className="material-symbols-outlined text-secondary text-xl mb-3 block">call</span>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-400 mb-1">Phone</h3>
              <a href="tel:+2347030003294" className="text-secondary font-semibold hover:text-secondary-container transition-colors text-sm">
                +234 703 000 3294
              </a>
            </div>
            <div className="bg-stone-900 p-5">
              <span className="material-symbols-outlined text-secondary text-xl mb-3 block">mail</span>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-400 mb-1">Email</h3>
              <a href="mailto:info@residentcement.com" className="text-secondary font-semibold hover:text-secondary-container transition-colors text-sm">
                info@residentcement.com
              </a>
            </div>
          </div>

          {/* Dealer CTA — inline */}
          <div className="border-t border-white/5 pt-8 mt-auto">
            <p className="text-stone-500 text-xs uppercase tracking-[0.2em] mb-3">Become a partner</p>
            <a
              href="https://rcdportal.nyamabo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-base">storefront</span>
              Open Dealer Account
            </a>
          </div>
        </div>

        {/* Right — form panel */}
        <div className="bg-stone-950 flex flex-col justify-center pt-20 lg:pt-0 pb-12 px-8 lg:px-14">
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Send a Message
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight mb-6">
              How Can We Help?
            </h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-stone-900 border border-white/10 text-white placeholder:text-stone-600 focus:border-secondary/50 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-stone-900 border border-white/10 text-white placeholder:text-stone-600 focus:border-secondary/50 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="block text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 mb-2">
                  Company / Organisation
                </label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 bg-stone-900 border border-white/10 text-white placeholder:text-stone-600 focus:border-secondary/50 focus:outline-none transition-colors"
                  placeholder="Your company"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 mb-2">
                  Enquiry Type
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-3 bg-stone-900 border border-white/10 text-white focus:border-secondary/50 focus:outline-none transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="partnership">Partnership / B2B</option>
                  <option value="dealer">Dealer Account</option>
                  <option value="quote">Request a Quote</option>
                  <option value="general">General Enquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-stone-900 border border-white/10 text-white placeholder:text-stone-600 focus:border-secondary/50 focus:outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-8 py-3.5 bg-secondary text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:brightness-110 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

      </div>

    </main>
  );
}
