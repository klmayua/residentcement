import Link from "next/link";

export default function PrivacyPage() {
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
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-[#1a1c1c] mb-8">Privacy Policy</h1>
        <p className="text-[#7e7667] text-sm uppercase tracking-widest mb-12">Last Updated: December 2024</p>

        <div className="prose prose-stone max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">1. Introduction</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">Resident Cement Company Limited ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">2. Information We Collect</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">We may collect information about you in various ways, including:</p>
            <ul className="list-disc list-inside text-[#4d4639] space-y-2">
              <li>Personal identification information (Name, email address, phone number, etc.)</li>
              <li>Business information (Company name, business address, tax identification)</li>
              <li>Transaction data (Order history, payment information)</li>
              <li>Technical data (IP address, browser type, device information)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">3. How We Use Your Information</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-[#4d4639] space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your account and orders</li>
              <li>Improve our products and services</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">4. Data Security</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">5. Your Rights</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">Under Nigerian data protection law, you have the right to:</p>
            <ul className="list-disc list-inside text-[#4d4639] space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request restriction of processing</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">6. Contact Us</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">If you have questions about this Privacy Policy, please contact us at:</p>
            <address className="text-[#4d4639] not-italic">
              Resident Cement Company Limited<br />
              Data Protection Officer<br />
              Plot 1234, Industrial District<br />
              Bauchi, Nigeria<br />
              Email: privacy@residentcement.com
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
          <Link href="/terms" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#745b17]">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
