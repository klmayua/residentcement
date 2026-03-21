import { Building2, Users, Award, Globe } from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Quality",
    description: "We never compromise on product quality, ensuring every bag meets international standards.",
  },
  {
    icon: Users,
    title: "Empowerment",
    description: "Creating jobs and empowering local communities through sustainable industrial development.",
  },
  {
    icon: Globe,
    title: "Sustainability",
    description: "Committed to environmentally responsible manufacturing with clean energy solutions.",
  },
  {
    icon: Building2,
    title: "Innovation",
    description: "Pioneering advanced cement technology through strategic global partnerships.",
  },
];

const milestones = [
  { year: "2023", title: "Company Founded", description: "Resident Cement Company Limited registered under Corporate Affairs Commission" },
  { year: "2024", title: "Mining Licenses Acquired", description: "Secured mining licenses throughout Nigeria" },
  { year: "2024", title: "Sinoma Partnership", description: "Strategic partnership with Sinoma Nigeria Company for technology transfer" },
  { year: "2025", title: "Bauchi Plant Construction", description: "Groundbreaking of $500M cement plant in Gwana District, Alkaleri LGA" },
  { year: "2026", title: "Production Launch", description: "Commercial production begins with 10 million tonnes annual capacity" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-brand-dark via-brand-secondary to-brand-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Resident Cement</h1>
            <p className="text-xl text-cement-200">
              Nigeria's emerging cement manufacturing giant — building a $500 million
              world-class cement plant in Bauchi State to power the nation's
              infrastructure transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-cement-900 mb-4">Our Mission</h2>
              <p className="text-cement-600 mb-6">
                To produce high-quality, affordable cement while contributing to Nigeria's
                economic development through job creation, sustainable industrial growth,
                and infrastructure advancement.
              </p>

              <h2 className="text-3xl font-bold text-cement-900 mb-4">Our Vision</h2>
              <p className="text-cement-600">
                To become a global leader in cement production, setting benchmarks for
                quality, innovation, and sustainability while powering Nigeria's
                infrastructure transformation.
              </p>
            </div>

            <div className="bg-cement-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "$500M", label: "Investment" },
                  { value: "10M", label: "Tons/Year" },
                  { value: "100-150MW", label: "Power Plant" },
                  { value: "36", label: "States" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-brand-primary">{stat.value}</div>
                    <div className="text-sm text-cement-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-cement-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-cement-900 mb-4">Our Values</h2>
            <p className="text-cement-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-6 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className="text-lg font-semibold text-cement-900 mb-2">{value.title}</h3>
                <p className="text-cement-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-cement-900 mb-4">Our Journey</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, idx) => (
              <div key={milestone.year} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-cement-200 my-2"></div>
                  )}
                </div>
                <div className="pb-8">
                  <div className="text-sm font-medium text-brand-primary">{milestone.year}</div>
                  <h3 className="text-lg font-semibold text-cement-900">{milestone.title}</h3>
                  <p className="text-cement-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
