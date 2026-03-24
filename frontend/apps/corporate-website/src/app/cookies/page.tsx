import Link from "next/link";

export default function CookiesPage() {
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
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-[#1a1c1c] mb-8">Cookie Policy</h1>
        <p className="text-[#7e7667] text-sm uppercase tracking-widest mb-12">Last Updated: December 2024</p>

        <div className="prose prose-stone max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">What Are Cookies</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">How We Use Cookies</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">Resident Cement uses cookies for the following purposes:</p>
            <ul className="list-disc list-inside text-[#4d4639] space-y-2">
              <li><strong>Essential cookies:</strong> Required for the operation of our website</li>
              <li><strong>Analytical cookies:</strong> Allow us to recognize and count visitors</li>
              <li><strong>Functionality cookies:</strong> Used to recognize you when you return</li>
              <li><strong>Targeting cookies:</strong> Record your visit to our website and pages visited</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">Managing Cookies</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">Most web browsers allow some control of cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-[#745b17] hover:underline">www.allaboutcookies.org</a>.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-4">Contact Us</h2>
            <p className="text-[#4d4639] leading-relaxed mb-4">If you have any questions about our Cookie Policy, please contact us at privacy@residentcement.com.</p>
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
