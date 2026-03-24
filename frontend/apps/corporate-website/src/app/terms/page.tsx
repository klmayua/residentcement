import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f8]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#f9f9f8]/70 backdrop-blur-md border-b border-[#e2e2e2]/50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#745b17] rounded"></div>
            <Link href="/" className="text-xl font-headline font-bold text-[#1a1c1c] tracking-tight">Resident Cement</Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-[#1a1c1c] mb-8">Terms of Service</h1>
        <p className="text-[#7e7667] text-sm uppercase tracking-widest mb-12">Last Updated: December 2024</p>

        <div className="prose prose-stone max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">1. Agreement to Terms</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">By accessing or using Resident Cement&apos;s services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">2. Description of Service</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">Resident Cement provides cement manufacturing, distribution, and related services to commercial and industrial customers throughout Nigeria. Our services include product sales, logistics coordination, and customer portal access.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">3. Account Registration</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">To access certain features of our service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">4. Ordering and Payment</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">All orders are subject to availability and confirmation of the order price. We reserve the right to refuse any order. Payment terms are net 30 days from invoice date unless otherwise agreed in writing.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">5. Delivery</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">Delivery times are estimates only and commence from the date of order confirmation. We are not responsible for delays outside our reasonable control.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">6. Limitation of Liability</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">In no event shall Resident Cement, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">7. Contact Information</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">Questions about the Terms of Service should be sent to us at legal@residentcement.com or mailed to:</p>
            <address className="text-[#4d4639] not-italic">
              Resident Cement Company Limited<br />
              Plot 1234, Industrial District<br />
              Bauchi, Nigeria<br />
              Postal Code: 740001
            </address>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#d0c5b4]">
          <Link href="/" className="text-[#745b17] hover:underline">&larr; Back to Home</Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#f4f4f3] flex flex-col md:flex-row justify-between items-center px-12 py-12">
        <div className="flex flex-col items-center md:items-start gap-4 mb-8 md:mb-0">
          <div className="font-headline font-bold text-lg tracking-tight text-[#1a1c1c]">Resident Cement</div>
          <p className="text-xs uppercase tracking-widest text-[#7e7667]">&copy; 2024 Resident Cement. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          <Link href="/sitemap" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17]">Sitemap</Link>
          <Link href="/contact" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17]">Contact</Link>
          <Link href="/privacy" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17]">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
