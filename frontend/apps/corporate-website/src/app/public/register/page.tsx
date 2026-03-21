import Link from "next/link";
import { Building2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Access to exclusive distributor pricing",
  "Dedicated account manager",
  "Priority delivery scheduling",
  "Credit terms available",
  "Bulk order discounts",
  "24/7 customer support",
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-cement-50">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-brand-dark via-brand-secondary to-brand-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Become a Distributor
            </h1>
            <p className="text-xl text-cement-200">
              Join Nigeria's leading cement distribution network
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-bold text-cement-900 mb-6">
                Distributor Benefits
              </h2>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-cement-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-brand-primary/5 rounded-xl p-6">
                <h3 className="font-semibold text-cement-900 mb-2">
                  Already a distributor?
                </h3>
                <p className="text-cement-600 mb-4">
                  Access your account to place orders, track deliveries, and manage your business.
                </p>
                <Link href="https://portal.residentcement.com">
                  <Button variant="outline">
                    Login to Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-cement-900 mb-2">
                Apply Now
              </h2>
              <p className="text-cement-600 mb-6">
                Fill out the form below and our team will contact you within 24 hours.
              </p>

              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1">
                      State *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    >
                      <option value="">Select State</option>
                      <option>Lagos</option>
                      <option>Abuja</option>
                      <option>Rivers</option>
                      <option>Kano</option>
                      <option>Oyo</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1">
                      Estimated Monthly Volume (bags) *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    >
                      <option value="">Select Range</option>
                      <option>100 - 500</option>
                      <option>500 - 1,000</option>
                      <option>1,000 - 5,000</option>
                      <option>5,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Business Type *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 rounded-lg border border-cement-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  >
                    <option value="">Select Type</option>
                    <option>Construction Company</option>
                    <option>Building Materials Store</option>
                    <option>Individual Contractor</option>
                    <option>Real Estate Developer</option>
                    <option>Other</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Submit Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-cement-500 text-center">
                  By submitting, you agree to our{" "}
                  <Link href="/terms/" className="text-brand-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy/" className="text-brand-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
