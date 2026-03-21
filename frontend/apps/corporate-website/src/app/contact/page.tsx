import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-brand-dark via-brand-secondary to-brand-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-cement-200 max-w-2xl mx-auto">
            Get in touch with our team. We're here to help with your cement needs.
          </p>
        </div>
      </section>

      <section className="py-20 bg-cement-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-cement-900 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-cement-900">Head Office</h3>
                    <p className="text-cement-600">
                      Resident Cement Company Limited
                      <br />
                      Corporate Headquarters, Abuja FCT
                      <br />
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-cement-900">Bauchi Plant</h3>
                    <p className="text-cement-600">
                      Gwana District, Alkaleri LGA
                      <br />
                      Bauchi State, Nigeria
                      <br />
                      <span className="text-brand-primary font-medium">10 Million Tonnes/Year Capacity</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-cement-900">Phone</h3>
                    <p className="text-cement-600">
                      Corporate: +234 800 RESIDENT
                      <br />
                      Sales: +234 800 737 4683
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-cement-900">Email</h3>
                    <p className="text-cement-600">
                      General: info@residentcement.com
                      <br />
                      Sales: sales@residentcement.com
                      <br />
                      Careers: careers@residentcement.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-cement-900">Business Hours</h3>
                    <p className="text-cement-600">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-cement-900 mb-6">Send us a Message</h2>

              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    placeholder="+234 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Subject
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none">
                    <option>General Inquiry</option>
                    <option>Sales / Distribution</option>
                    <option>Distributor Partnership</option>
                    <option>Careers / Recruitment</option>
                    <option>Media / Press</option>
                    <option>Investor Relations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
