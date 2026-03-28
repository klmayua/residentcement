import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-stone-950 text-white w-full">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 lg:px-10 pt-16 pb-12">
        <div>
          <div
            className="h-12 w-48 mb-5"
            style={{
              background: '#e5c374',
              WebkitMaskImage: "url('/images/real/logo-main.png')",
              maskImage: "url('/images/real/logo-main.png')",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "left center",
              maskPosition: "left center",
            }}
            role="img"
            aria-label="Resident Ciment Bauchi Ltd"
          />
          <p className="text-stone-500 text-[13px] leading-relaxed mb-5">
            A leading producer of high-quality cement registered under the
            Corporate Affairs Commission of Nigeria.
          </p>
          <div className="flex gap-3">
            <a
              href="mailto:info@residentcement.com"
              className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-secondary/20 text-stone-500 hover:text-secondary transition-all"
              aria-label="Email"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
            </a>
            <a
              href="tel:+2347030003294"
              className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-secondary/20 text-stone-500 hover:text-secondary transition-all"
              aria-label="Phone"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.15 1.21 2 2 0 012.11.01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-5 text-stone-400">
            Company
          </h5>
          <ul className="space-y-2.5">
            {[
              ["/about/", "About Us"],
              ["/team/", "Leadership"],
              ["/b2b/", "B2B Operations"],
              ["/media/", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-stone-500 text-[13px] hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-5 text-stone-400">
            Products &amp; Services
          </h5>
          <ul className="space-y-2.5">
            {[
              ["/products/", "Our Products"],
              ["https://rcdportal.nyamabo.com", "Dealer Portal"],
              ["https://rcb2bportal.nyamabo.com", "B2B Portal"],
              ["https://rcerp.nyamabo.com", "ERP Console"],
              ["/media/", "Request a Quote"],
            ].map(([href, label]) => (
              <li key={label}>
                {href.startsWith("http") ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-500 text-[13px] hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    href={href}
                    className="text-stone-500 text-[13px] hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-5 text-stone-400">
            Head Office
          </h5>
          <address className="text-stone-500 text-[13px] leading-relaxed not-italic mb-4">
            No. 38 Mike Akhigbe Way
            <br />
            Jabi, Abuja, Nigeria
          </address>
          <a
            href="tel:+2347030003294"
            className="text-secondary font-semibold text-sm hover:text-secondary-container transition-colors"
          >
            +234 703 000 3294
          </a>
          <div className="mt-4 pt-4 border-t border-white/5">
            <span className="text-[10px] text-stone-600 uppercase tracking-[0.15em] block mb-1">
              Plant Location
            </span>
            <span className="text-stone-500 text-[13px]">
              Gwana District, Alkaleri LGA
              <br />
              Bauchi State
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 lg:px-10 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span className="text-[10px] text-stone-600 uppercase tracking-[0.15em]">
            &copy; {new Date().getFullYear()} Resident Ciment Bauchi Ltd
          </span>
          <div className="flex gap-6">
            <Link
              href="/privacy/"
              className="text-[10px] text-stone-600 uppercase tracking-[0.15em] hover:text-stone-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms/"
              className="text-[10px] text-stone-600 uppercase tracking-[0.15em] hover:text-stone-400 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

