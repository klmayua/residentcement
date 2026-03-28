import Link from "next/link";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-stone-500 text-sm">Last updated: January 1, 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 lg:px-10">
        <div className="max-w-[800px] mx-auto space-y-10">
          {[
            { title: "1. Introduction", content: "Resident Cement Bachi Ltd (\u201cwe,\u201d \u201cour,\u201d or \u201cus\u201d) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our website and services." },
            { title: "2. Information We Collect", content: "We collect personal information (name, contact details, business information, communication preferences) and usage information (IP address, browser type, pages visited, device information) to provide and improve our services." },
            { title: "3. How We Use Your Information", list: ["Provide and maintain our services", "Respond to your inquiries and requests", "Send updates and marketing communications (with your consent)", "Improve our website and services", "Comply with legal obligations", "Protect our rights and prevent fraud"] },
            { title: "4. Information Sharing", content: "We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist in our operations, legal authorities when required by law, and business partners with your explicit consent." },
            { title: "5. Data Security", content: "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure." },
            { title: "6. Cookies", content: "We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences. Disabling cookies may affect the functionality of our website." },
            { title: "7. Your Rights", list: ["Access your personal information", "Correct inaccurate data", "Request deletion of your data", "Object to processing of your data", "Withdraw consent at any time", "Data portability"] },
            { title: "8. Third-Party Links", content: "Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites." },
            { title: "9. Children\u2019s Privacy", content: "Our services are not directed to individuals under 18. We do not knowingly collect personal information from children." },
            { title: "10. Changes to This Policy", content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page." },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="font-serif text-xl font-semibold mb-3">{section.title}</h2>
              {section.content && (
                <p className="text-stone-400 leading-relaxed text-[15px]">{section.content}</p>
              )}
              {section.list && (
                <ul className="text-stone-400 text-[15px] leading-relaxed space-y-1.5 list-disc list-inside">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div>
            <h2 className="font-serif text-xl font-semibold mb-3">11. Contact Us</h2>
            <p className="text-stone-400 leading-relaxed text-[15px] mb-4">
              For questions about this Privacy Policy, please contact us:
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
