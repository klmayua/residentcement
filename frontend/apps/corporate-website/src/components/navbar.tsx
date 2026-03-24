"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/operations", label: "Operations" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/investors", label: "Investors" },
  { href: "/products", label: "Products" },
  { href: "/media", label: "Media" },
  { href: "/careers", label: "Careers" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass-nav border-b border-outline-variant/10"
          : "bg-transparent"
      )}
    >
      <div className="container-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className={cn(
              "text-xl font-black uppercase tracking-tighter transition-colors",
              isScrolled ? "text-primary" : "text-white"
            )}>
              RESIDENT CEMENT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={cn(
                  "text-xs font-semibold uppercase tracking-widest transition-colors duration-300",
                  isScrolled
                    ? activeLink === link.href
                      ? "text-primary"
                      : "text-on-surface/60 hover:text-secondary"
                    : activeLink === link.href
                    ? "text-secondary"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            <button
              className={cn(
                "transition-colors duration-300",
                isScrolled ? "text-primary" : "text-white"
              )}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/investors"
              className={cn(
                "hidden sm:inline-flex px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                isScrolled
                  ? "bg-primary text-white hover:brightness-110"
                  : "bg-white text-primary hover:bg-white/90"
              )}
            >
              Investor Portal
            </Link>

            {/* Mobile Menu Button */}
            <button
              className={cn(
                "lg:hidden p-2 transition-colors",
                isScrolled
                  ? "text-primary hover:text-secondary"
                  : "text-white hover:text-white/80"
              )}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-surface",
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="flex flex-col gap-1 py-4 border-t border-outline-variant/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.href);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "text-sm font-medium transition-colors py-3 px-4",
                  activeLink === link.href
                    ? "text-primary bg-surface-container"
                    : "text-on-surface-variant hover:text-foreground hover:bg-surface-container-low"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 px-4">
              <Link
                href="/investors"
                className="btn-primary block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Investor Portal
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
