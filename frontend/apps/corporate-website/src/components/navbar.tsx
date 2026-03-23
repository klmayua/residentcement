"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products/", label: "Products" },
  { href: "/about/", label: "About" },
  { href: "/sustainability/", label: "Sustainability" },
  { href: "/careers/", label: "Careers" },
  { href: "/contact/", label: "Contact" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-outline-variant/10">
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Building2 className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xl font-headline font-bold text-foreground tracking-tight">
              Resident
              <span className="text-primary">Cement</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-200",
                  activeLink === link.href
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-foreground"
                )}
              >
                {link.label}
                {activeLink === link.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="https://portal.residentcement.com" target="_blank">
              <Button variant="ghost" size="sm" className="text-on-surface-variant hover:text-foreground">
                Distributor Login
              </Button>
            </Link>
            <Link href="/contact/">
              <Button
                size="sm"
                className="btn-gold"
              >
                Get Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-on-surface-variant hover:text-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="flex flex-col gap-4 py-4 border-t border-outline-variant/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.href);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "text-sm font-medium transition-colors py-2",
                  activeLink === link.href
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant/10">
              <Link href="https://portal.residentcement.com" target="_blank">
                <Button variant="outline" className="w-full">
                  Distributor Login
                </Button>
              </Link>
              <Link href="/contact/">
                <Button className="w-full btn-gold">
                  Get Quote
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
