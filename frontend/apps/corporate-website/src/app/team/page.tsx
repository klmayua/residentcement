import Image from "next/image";
import Link from "next/link";

const managementBoard = [
  { name: "Dr. Abbas A. Waziri", role: "Group Chairman", photo: "/images/real/team/chairman-waziri.webp" },
  { name: "Alh. Abba Goji", role: "Vice Chairman", photo: "/images/real/team/vc-goji.webp" },
  { name: "Maj. Gen. Aliyu S. Dili (Rtd)", role: "Director, Operations", photo: "/images/real/team/dir-eki.webp" },
  { name: "Sam O. Worlu", role: "Director, Finance", photo: "/images/real/team/dir-worlu.webp" },
  { name: "Dr. Garba Abdullahi", role: "Director, Plant", photo: "/images/real/team/dir-abdullahi.webp" },
  { name: "Ifeanyi Maduechesi", role: "Executive Director", photo: "/images/real/team/ed-maduechesi.webp" },
  { name: "Engr. Aminu Nuhu", role: "Director, Project", photo: "/images/real/team/dir-nuhu.webp" },
  { name: "Alh. Abdulmumini Ahmed Male", role: "Director, Corporate Services", photo: "/images/real/team/dir-ahmed-male.webp" },
  { name: "Ali Dahuwa Abdulhamid", role: "Director, Human Resources", photo: "/images/real/team/dir-abdulhamid.webp" },
  { name: "Mohammed Abubakar", role: "Director, Logistics", photo: "/images/real/team/dir-abubakar.webp" },
];

const advisoryBoard = [
  { name: "Sen. Gen. Sani Sale", role: "Chairman, Advisory Board", photo: "/images/real/team/adv-sani-sale.webp" },
  { name: "Engr. Dr. Bello Suleiman", role: "Member", photo: "/images/real/team/adv-suleiman.webp" },
  { name: "Mrs. Nkiru Asiegbu", role: "Member", photo: "/images/real/team/adv-asiegbu.webp" },
  { name: "Zaki Ahmed (FMR DIG)", role: "Member", photo: "/images/real/team/adv-ahmed.webp" },
  { name: "Hajia Rakiya Mohamed", role: "Member", photo: "/images/real/team/adv-mohamed.webp" },
  { name: "Dr. Adenrele Adesina", role: "Member", photo: "/images/real/team/adv-adesina.webp" },
  { name: "Dogondaji Ahmed Shehu", role: "Member", photo: "/images/real/team/adv-shehu.webp" },
  { name: "Dr. Manir Dan Iya", role: "Member", photo: "/images/real/team/adv-dan-iya.webp" },
  { name: "Aminu Ibrahim Babangida", role: "Member", photo: "/images/real/team/adv-babangida.webp" },
  { name: "Edith Chidinma Uwajumogu", role: "BA, MSc, LLB, PhD", photo: "/images/real/team/adv-uwajumogu.webp" },
  { name: "Engr. Mohammed Gambo Umar", role: "MNI, FNSE, FNIM", photo: "/images/real/team/adv-gambo-umar.webp" },
  { name: "Hon. Justice Lawal Gumi", role: "HRH Emir of Gumi", photo: "/images/real/team/adv-gumi.webp" },
  { name: "Gen. Martin Luther Agwai", role: "Member", photo: "/images/real/team/adv-agwai.webp" },
  { name: "Musa Mahamood", role: "Director", photo: "/images/real/team/adv-mahamood.webp" },
];

export default function TeamPage() {
  return (
    <main className="bg-stone-950 text-white">
      {/* Hero */}
      <section className="pt-20 pb-10 px-6 lg:px-10 bg-stone-950">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
            Leadership
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Our People
          </h1>
          <p className="text-stone-400 text-lg max-w-xl leading-relaxed">
            The experienced leaders driving Resident Ciment&apos;s mission to deliver world-class building materials across Nigeria.
          </p>
        </div>
      </section>

      {/* Chairman Spotlight */}
      <section className="py-14 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative overflow-hidden">
            <Image
              src="/images/real/team/chairman-waziri.webp"
              alt="Dr. Abbas A. Waziri - Group Chairman"
              width={600}
              height={700}
              className="w-full h-[520px] object-cover object-top"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-stone-950 to-transparent">
              <span className="gold-gradient-text text-sm font-bold uppercase tracking-[0.2em]">
                Group Chairman
              </span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Chairman&apos;s Vision
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Dr. Abbas A. Waziri
            </h2>
            <blockquote className="text-stone-400 text-lg leading-relaxed mb-8 border-l-2 border-secondary/30 pl-6">
              &ldquo;Resident Ciment was established with a singular vision  to build a world-class cement manufacturing company that serves Nigeria&apos;s growing infrastructure needs while creating lasting value for our communities and stakeholders.&rdquo;
            </blockquote>
            <p className="text-stone-500 leading-relaxed mb-8">
              Under Dr. Waziri&apos;s leadership, Resident Ciment has secured world-class partnerships, including the landmark EPC agreement with Sinoma International Engineering for the construction of a 10 million metric tonnes per annum greenfield cement plant in Gwana, Bauchi State.
            </p>
            <Link
              href="/about/"
              className="inline-flex items-center gap-2 text-secondary text-sm font-semibold hover:text-secondary-container transition-colors"
            >
              Learn more about our story
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Management Board */}
      <section className="py-14 px-6 lg:px-10 bg-stone-900/40">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Executive Team
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Management Board
            </h2>
            <p className="text-stone-500 max-w-2xl leading-relaxed">
              Our management board brings together decades of expertise in cement manufacturing, engineering, finance, and corporate governance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {managementBoard.map((member) => (
              <div key={member.name} className="group">
                <div className="relative aspect-square overflow-hidden mb-4 bg-stone-900">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                </div>
                <h3 className="font-serif text-sm font-semibold leading-tight mb-0.5">
                  {member.name}
                </h3>
                <p className="text-secondary text-[11px]">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="py-14 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-3 block">
              Strategic Counsel
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Advisory Board
            </h2>
            <p className="text-stone-500 max-w-2xl leading-relaxed">
              Distinguished leaders in government, military, law, engineering, and business who provide strategic direction and oversight.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5">
            {advisoryBoard.map((member) => (
              <div key={member.name} className="group">
                <div className="relative aspect-square overflow-hidden mb-3 bg-stone-900">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 14vw"
                    className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                </div>
                <h3 className="font-serif text-[13px] font-semibold leading-tight mb-0.5">
                  {member.name}
                </h3>
                <p className="text-stone-500 text-[10px]">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gold-gradient py-20 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
              Partner With Us
            </h2>
            <p className="text-white/70">
              Join Nigeria&apos;s fastest growing cement company as a dealer or corporate partner.
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://rcdportal.nyamabo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white text-stone-950 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-colors"
            >
              Dealer Portal
            </a>
            <Link
              href="/media/"
              className="px-8 py-3.5 border border-white/30 text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

