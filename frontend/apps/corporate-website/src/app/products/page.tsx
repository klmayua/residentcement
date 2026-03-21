import Link from "next/link";
import { Package, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    name: "Resident Cement 42.5R",
    grade: "Premium",
    description: "High-strength Portland cement ideal for structural applications, bridges, and high-rise buildings.",
    price: "₦4,500",
    unit: "50kg bag",
    features: [
      "Compressive strength: 42.5 MPa",
      "Fast setting time",
      "Superior durability",
      "Perfect for reinforced concrete",
    ],
    applications: ["High-rise buildings", "Bridges", "Industrial structures", "Prefabricated elements"],
  },
  {
    name: "Resident Cement 32.5R",
    grade: "Standard",
    description: "General purpose cement for plastering, masonry, and standard construction works.",
    price: "₦4,200",
    unit: "50kg bag",
    features: [
      "Compressive strength: 32.5 MPa",
      "Smooth finish",
      "Excellent workability",
      "Cost-effective",
    ],
    applications: ["Residential buildings", "Plastering", "Flooring", "General masonry"],
  },
  {
    name: "Resident Cement 52.5R",
    grade: "High Strength",
    description: "Ultra-high strength cement for demanding infrastructure and specialized construction.",
    price: "₦5,200",
    unit: "50kg bag",
    features: [
      "Compressive strength: 52.5 MPa",
      "Rapid strength gain",
      "Low heat of hydration",
      "Exceptional performance",
    ],
    applications: ["Airport runways", "Dam construction", "Heavy industrial", "Marine structures"],
  },
  {
    name: "Resident Pozzolana 32.5N",
    grade: "Eco-Friendly",
    description: "Environmentally friendly cement with pozzolanic properties for sustainable construction.",
    price: "₦4,100",
    unit: "50kg bag",
    features: [
      "Lower carbon footprint",
      "Improved chemical resistance",
      "Reduced heat of hydration",
      "Enhanced durability",
    ],
    applications: ["Mass concrete", "Marine environments", "Sustainable projects", "Water treatment"],
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-brand-dark via-brand-secondary to-brand-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-cement-200 max-w-2xl mx-auto">
            Premium cement grades suitable for every construction need,
            from residential buildings to major infrastructure projects.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-cement-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-cement-200 to-cement-300 flex items-center justify-center">
                  <Package className="h-24 w-24 text-cement-500" />
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-brand-primary/10 text-brand-primary">
                      {product.grade}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-cement-900 mb-3">{product.name}</h2>
                  <p className="text-cement-600 mb-6">{product.description}</p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-cement-900 mb-2">Key Features</h4>
                      <ul className="space-y-1">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-cement-600">
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-cement-900 mb-2">Applications</h4>
                      <ul className="space-y-1">
                        {product.applications.map((app) => (
                          <li key={app} className="flex items-center gap-2 text-sm text-cement-600">
                            <Check className="h-4 w-4 text-brand-primary shrink-0" />
                            {app}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-cement-100">
                    <div>
                      <span className="text-3xl font-bold text-brand-primary">{product.price}</span>
                      <span className="text-cement-500"> / {product.unit}</span>
                    </div>

                    <Link href="/contact/">
                      <Button>
                        Request Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Orders */}
      <section className="py-20 bg-brand-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Bulk Orders?</h2>
            <p className="text-xl text-white/80 mb-8">
              We offer competitive pricing for large-scale projects and
              long-term supply contracts. Contact our sales team for
              customized quotes.
            </p>
            <Link href="/contact/">
              <Button size="lg" className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90">
                Contact Sales Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
