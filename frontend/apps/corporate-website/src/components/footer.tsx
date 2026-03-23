import Link from "next/link";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  products: [
    { label: "Premium Cement", href: "/products/" },
    { label: "Standard Cement", href: "/products/" },
    { label: "High Strength", href: "/products/" },
    { label: "Eco-Friendly", href: "/sustainability/" },
  ],
  company: [
    { label: "About Us", href: "/about/" },
    { label: "Our Team", href: "/about/" },
    { label: "Sustainability", href: "/sustainability/" },
    { label: "Careers", href: "/careers/" },
  ],
  support: [
    { label: "Contact Us", href: "/contact/" },
    { label: "Distributor Portal", href: "https://portal.residentcement.com" },
    { label: "Privacy Policy", href: "/privacy/" },
    { label: "Terms of Service", href: "/terms/" },
  ],
};

const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Twitter", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-surface-container-high border-t border-outline-variant/10">
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <Building2 className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <span className="text-xl font-headline font-bold text-foreground tracking-tight">
                Resident
                <span className="text-primary">Cement</span>
              </span>
            </Link>

            <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">
              Resident Cement Company Limited — Building Nigeria&apos;s future with our
              world-class cement plant in Bauchi State. 10 million tonnes
              annual capacity.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-on-surface-variant text-sm">
                  Gwana District, Alkaleri LGA,
                  <br />
                  Bauchi State, Nigeria
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+2341234567890" className="text-on-surface-variant hover:text-primary transition-colors text-sm">
                  +234 123 456 7890
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:info@residentcement.com" className="text-on-surface-variant hover:text-primary transition-colors text-sm">
                  info@residentcement.com
                </a>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            <h3 className="font-headline font-bold text-foreground mb-6 text-sm uppercase tracking-widest">
              Products
            </h3>
            <ul className="space-y-4">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="font-headline font-bold text-foreground mb-6 text-sm uppercase tracking-widest">
              Company
            </h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="font-headline font-bold text-foreground mb-6 text-sm uppercase tracking-widest">
              Support
            </h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="lg:col-span-2">
            <h3 className="font-headline font-bold text-foreground mb-6 text-sm uppercase tracking-widest">
              Social
            </h3>
            <ul className="space-y-4">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant/60 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Resident Cement Company Limited. Built for Permanence.
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-on-surface-variant/40">
              Architectural Grade
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-on-surface-variant/40">
              ISO 9001
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
