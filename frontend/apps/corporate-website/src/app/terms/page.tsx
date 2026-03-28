import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="bg-stone-950 text-white">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[320px] flex items-end pt-20 bg-stone-900">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900 to-stone-900" />
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
            Legal
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-2">
            Terms of Service
          </h1>
          <p className="text-stone-500 text-sm">Last updated: January 1, 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 lg:px-10">
        <div className="max-w-[800px] mx-auto space-y-10">
          {[
            { title: "1. Acceptance of Terms", content: "By accessing and using the Resident Ciment website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service." },
            { title: "2. Services", content: "Resident Ciment Bauchi Ltd provides cement manufacturing, distribution, and related services. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice." },
            { title: "3. User Responsibilities", content: "You agree to use our services only for lawful purposes and in accordance with these Terms.", list: ["Use our services in any way that violates applicable laws or regulations", "Attempt to gain unauthorised access to our systems or networks", "Interfere with or disrupt the integrity or performance of our services", "Transmit any viruses, worms, defects, or destructive code", "Collect or harvest any personally identifiable information from our services"] },
            { title: "4. Intellectual Property", content: "All content, features, and functionality of our services, including but not limited to text, graphics, logos, and software, are the exclusive property of Resident Ciment Bauchi Ltd and are protected by copyright, trademark, and other intellectual property laws." },
            { title: "5. Disclaimer of Warranties", content: "Our services are provided on an \u201cas is\u201d and \u201cas available\u201d basis without any warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, error-free, or completely secure." },
            { title: "6. Limitation of Liability", content: "To the maximum extent permitted by law, Resident Ciment Bauchi Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services." },
            { title: "7. Indemnification", content: "You agree to indemnify, defend, and hold harmless Resident Ciment Bauchi Ltd and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses arising out of your use of our services or violation of these Terms." },
            { title: "8. Governing Law", content: "These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions." },
            { title: "9. Changes to Terms", content: "We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page." },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="font-serif text-xl font-semibold mb-3">{section.title}</h2>
              {section.content && (
                <p className="text-stone-400 leading-relaxed text-[15px]">{section.content}</p>
              )}
              {section.list && (
                <ul className="text-stone-400 text-[15px] leading-relaxed space-y-1.5 list-disc list-inside mt-3">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div>
            <h2 className="font-serif text-xl font-semibold mb-3">10. Contact Information</h2>
            <p className="text-stone-400 leading-relaxed text-[15px] mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="text-stone-500 text-sm space-y-1">
              <p>Email: info@residentcement.com</p>
              <p>Phone: +234 703 000 3294</p>
              <p>Address: No. 38 Mike Akhigbe Way, Jabi, Abuja, Nigeria</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <Link href="/" className="text-secondary text-sm hover:text-secondary-container transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


