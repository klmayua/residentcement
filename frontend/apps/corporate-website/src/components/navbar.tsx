"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/about/", label: "About" },
    { href: "/products/", label: "Products" },
    { href: "/b2b/", label: "B2B Operations" },
    { href: "/team/", label: "Corporate" },
    { href: "/media/", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "glass-nav" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <div
                className="h-11 w-44 transition-all duration-500"
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
                aria-label="Resident Cement Bachi Ltd"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-secondary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="https://rcdportal.nyamabo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] bg-secondary text-white hover:bg-secondary/90 transition-all"
              >
                Dealer Portal
              </a>

              <button
                className="lg:hidden p-2 text-white hover:text-white/80"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 bg-stone-950 border-l border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <span className="text-sm font-bold text-white uppercase tracking-widest">
                Menu
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-white/60"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium py-3 px-4 text-white/60 hover:text-secondary hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 mt-4 border-t border-white/5">
                <a
                  href="https://rcdportal.nyamabo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] bg-secondary text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dealer Portal
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
