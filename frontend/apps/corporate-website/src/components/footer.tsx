import Link from "next/link";
import { Globe, Share2, Mail } from "lucide-react";

const footerLinks = {
  corporate: [
    { label: "Governance", href: "/governance" },
    { label: "Ethics", href: "/ethics" },
    { label: "Supply Chain", href: "/supply-chain" },
    { label: "Privacy", href: "/privacy" },
  ],
  operations: [
    { label: "Safety", href: "/safety" },
    { label: "Contact", href: "/contact" },
    { label: "Technical Specs", href: "/technical-specs" },
    { label: "Logistics", href: "/logistics" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface-container-low w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 sm:px-8 lg:px-12 xl:px-16 py-20 container-full mx-auto">
        {/* Brand Column */}
        <div className="md:col-span-1">
          <div className="text-xl font-black text-primary uppercase tracking-tighter mb-6">
            RESIDENT CEMENT
          </div>
          <p className="text-on-surface/50 text-sm leading-relaxed mb-8">
            Architectural integrity and industrial scale for the West African landscape. A legacy built on the strength of raw materials.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-on-surface/50 hover:text-secondary transition-colors"
              aria-label="Website"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-on-surface/50 hover:text-secondary transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </a>
            <a
              href="mailto:info@residentcement.com"
              className="text-on-surface/50 hover:text-secondary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Corporate Links */}
        <div className="md:col-span-1">
          <h5 className="text-xs font-bold uppercase tracking-widest mb-8 text-primary">
            Corporate
          </h5>
          <ul className="space-y-4">
            {footerLinks.corporate.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-on-surface/50 text-xs tracking-tight hover:text-primary transition-all"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Operations Links */}
        <div className="md:col-span-1">
          <h5 className="text-xs font-bold uppercase tracking-widest mb-8 text-primary">
            Operations
          </h5>
          <ul className="space-y-4">
            {footerLinks.operations.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-on-surface/50 text-xs tracking-tight hover:text-primary transition-all"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Headquarters */}
        <div className="md:col-span-1">
          <h5 className="text-xs font-bold uppercase tracking-widest mb-8 text-primary">
            Headquarters
          </h5>
          <div className="text-on-surface/50 text-xs leading-loose">
            Monolith Plaza, Suite 400
            <br />
            Industrial District, Lagos
            <br />
            Nigeria
            <br />
            <br />
            <span className="text-primary font-bold">+234 (0) 1 555 0192</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-surface-container px-6 sm:px-8 lg:px-12 xl:px-16 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40">
          © 2024 RESIDENT CEMENT. ARCHITECTURAL INTEGRITY.
        </span>
        <div className="flex gap-8">
          <Link
            href="/terms"
            className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40 hover:text-secondary transition-colors"
          >
            Terms of Use
          </Link>
          <Link
            href="/cookies"
            className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40 hover:text-secondary transition-colors"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
