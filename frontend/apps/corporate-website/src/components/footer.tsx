import Link from "next/link";
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
  products: [
    { label: "Premium Cement", href: "/products/" },
    { label: "Standard Cement", href: "/products/" },
    { label: "High Strength", href: "/products/" },
    { label: "Eco-Friendly", href: "/products/" },
  ],
  company: [
    { label: "About Us", href: "/about/" },
    { label: "Our Team", href: "/about/" },
    { label: "Sustainability", href: "/sustainability/" },
    { label: "Careers", href: "/careers/" },
  ],
  support: [
    { label: "Contact Us", href: "/contact/" },
    { label: "FAQs", href: "/contact/" },
    { label: "Distributor Portal", href: "http://localhost:3000" },
    { label: "Privacy Policy", href: "/privacy/" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-cement-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-brand-accent" />
              <span className="text-xl font-bold">
                Resident
                <span className="text-brand-accent">Cement</span>
              </span>
            </div>
            <p className="text-cement-400 text-sm">
              Nigeria's premier cement distribution platform, delivering quality
              building materials nationwide since 2020.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-cement-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-cement-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-cement-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-cement-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-cement-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-cement-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-accent shrink-0" />
                <span className="text-cement-400 text-sm">
                  123 Cement Road, Industrial District,
                  <br />
                  Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-accent shrink-0" />
                <a href="tel:+2341234567890" className="text-cement-400 hover:text-white text-sm">
                  +234 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-accent shrink-0" />
                <a href="mailto:info@residentcement.com" className="text-cement-400 hover:text-white text-sm">
                  info@residentcement.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cement-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cement-400 text-sm">
            © {new Date().getFullYear()} ResidentCement. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy/" className="text-cement-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms/" className="text-cement-400 hover:text-white text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
