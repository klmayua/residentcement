import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, ArrowRight } from "lucide-react";

const contactOptions = [
  {
    title: "General Inquiries",
    email: "info@residentcement.com",
    phone: "+234 (0) 1 555 0192",
    icon: Mail,
  },
  {
    title: "Sales & Distribution",
    email: "sales@residentcement.com",
    phone: "+234 (0) 1 555 0193",
    icon: Phone,
  },
  {
    title: "Investor Relations",
    email: "investors@residentcement.com",
    phone: "+234 (0) 1 555 0194",
    icon: Mail,
  },
  {
    title: "Media & Press",
    email: "media@residentcement.com",
    phone: "+234 (0) 1 555 0195",
    icon: Mail,
  },
];

const locations = [
  {
    name: "Corporate Headquarters",
    address: "Monolith Plaza, Suite 400\nIndustrial District, Lagos\nNigeria",
  },
  {
    name: "Gwana Plant",
    address: "Gwana District, Alkaleri LGA\nBauchi State, Nigeria\n10M Tonnes Annual Capacity",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2070&auto=format&fit=crop"
            alt="Contact"
            fill
            className="object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 container-full px-6 sm:px-8 lg:px-12 xl:px-16 pt-16">
          <span className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-6 block">
            Contact
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-extrabold text-white leading-[0.9] tracking-tighter mb-8 max-w-4xl">
            Get in Touch
          </h1>
          <p className="text-stone-300 text-lg md:text-xl max-w-2xl font-light">
            Connect with our teams across Nigeria. Whether you&apos;re an investor, distributor,
            or future team member, we&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Options Grid */}
      <section className="section-padding bg-surface">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-stone-200">
            {contactOptions.map((option) => (
              <div key={option.title} className="bg-white p-10 group hover:bg-primary transition-colors duration-500">
                <option.icon className="w-8 h-8 text-secondary mb-6 group-hover:text-secondary" />
                <h3 className="text-lg font-headline font-bold mb-4 group-hover:text-white transition-colors">
                  {option.title}
                </h3>
                <p className="text-sm text-stone-500 mb-2 group-hover:text-stone-300 transition-colors">
                  {option.email}
                </p>
                <p className="text-sm text-stone-500 group-hover:text-stone-300 transition-colors">
                  {option.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-surface-container-low">
        <div className="container-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div className="bg-white p-10 md:p-16">
              <span className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4 block">
                Send a Message
              </span>
              <h2 className="text-3xl font-headline font-bold mb-8">Contact Form</h2>

              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-surface-container-highest border-0 border-b-2 border-primary px-4 py-4 text-foreground focus:outline-none focus:border-secondary transition-all"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-surface-container-highest border-0 border-b-2 border-primary px-4 py-4 text-foreground focus:outline-none focus:border-secondary transition-all"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-surface-container-highest border-0 border-b-2 border-primary px-4 py-4 text-foreground focus:outline-none focus:border-secondary transition-all"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">
                    Subject
                  </label>
                  <select className="w-full bg-surface-container-highest border-0 border-b-2 border-primary px-4 py-4 text-foreground focus:outline-none focus:border-secondary transition-all"
                  >
                    <option>General Inquiry</option>
                    <option>Sales / Distribution</option>
                    <option>Distributor Partnership</option>
                    <option>Careers / Recruitment</option>
                    <option>Media / Press</option>
                    <option>Investor Relations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-surface-container-highest border-0 border-b-2 border-primary px-4 py-4 text-foreground focus:outline-none focus:border-secondary transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Locations */}
            <div>
              <span className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4 block">
                Our Locations
              </span>
              <h2 className="text-3xl font-headline font-bold mb-8">Offices</h2>

              <div className="space-y-8">
                {locations.map((location) => (
                  <div key={location.name} className="bg-white p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <MapPin className="w-6 h-6 text-secondary flex-shrink-0" />
                      <div>
                        <h3 className="font-headline font-bold text-lg mb-2">{location.name}</h3>
                        <p className="text-stone-600 whitespace-pre-line text-sm">{location.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-primary text-white p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Clock className="w-6 h-6 text-secondary" />
                  <h3 className="font-headline font-bold text-lg">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-stone-300">
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] bg-surface-container relative">
        <div className="absolute inset-0 flex items-center justify-center bg-stone-200">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-secondary mx-auto mb-4" />
            <p className="text-stone-600">Interactive Map Integration</p>
            <p className="text-stone-400 text-sm">Lagos Office • Bauchi Plant</p>
          </div>
        </div>
      </section>
    </main>
  );
}
