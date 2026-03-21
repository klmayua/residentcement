import { Briefcase, Users, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: Award, title: "Competitive Salary", description: "Market-leading compensation packages" },
  { icon: Heart, title: "Health Insurance", description: "Comprehensive medical coverage" },
  { icon: Users, title: "Great Culture", description: "Collaborative and inclusive workplace" },
  { icon: Briefcase, title: "Growth", description: "Professional development opportunities" },
];

const openings = [
  { title: "Sales Manager", department: "Sales", location: "Lagos", type: "Full-time" },
  { title: "Logistics Coordinator", department: "Operations", location: "Abuja", type: "Full-time" },
  { title: "Customer Service Rep", department: "Support", location: "Remote", type: "Full-time" },
  { title: "Warehouse Supervisor", department: "Operations", location: "Port Harcourt", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-br from-brand-dark via-brand-secondary to-brand-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-cement-200 max-w-2xl mx-auto">
            Build your career with Nigeria's leading cement distribution platform
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-cement-900 mb-4">Why Work With Us?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-lg font-semibold text-cement-900 mb-2">{benefit.title}</h3>
                <p className="text-cement-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-cement-900 mb-6">Open Positions</h2>

          <div className="space-y-4">
            {openings.map((job) => (
              <div key={job.title} className="bg-cement-50 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-cement-900">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-cement-600">
                    <span>{job.department}</span>
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <Button>Apply Now</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
