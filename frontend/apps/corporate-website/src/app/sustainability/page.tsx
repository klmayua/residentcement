import { Leaf, Droplets, Sun, Recycle, TreePine } from "lucide-react";

const initiatives = [
  {
    icon: Leaf,
    title: "Carbon Reduction",
    description: "Committed to reducing our carbon footprint through efficient logistics and operations.",
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    description: "Implementing water recycling systems in our warehousing facilities.",
  },
  {
    icon: Sun,
    title: "Solar Energy",
    description: "Transitioning to solar power for our operations where feasible.",
  },
  {
    icon: Recycle,
    title: "Waste Reduction",
    description: "Minimizing packaging waste through optimized distribution processes.",
  },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-br from-green-700 to-green-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TreePine className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sustainability</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Building a greener future for Nigeria's construction industry
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-cement-900 mb-4">Our Commitment</h2>
            <p className="text-cement-600">
              At ResidentCement, we believe sustainable business practices are not just
              good for the environment—they're good for business. We're committed to
              reducing our environmental impact while delivering exceptional service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiatives.map((initiative) => (
              <div key={initiative.title} className="bg-cement-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <initiative.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-cement-900 mb-2">{initiative.title}</h3>
                <p className="text-cement-600 text-sm">{initiative.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
