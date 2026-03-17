"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock, Eye, EyeOff, Phone, User, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/login?registered=true");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cement-50 via-white to-cement-100 py-12 px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="Resident Cement Limited" className="h-16 mx-auto mb-6" />
          <h1 className="font-display text-2xl font-bold text-cement-900 mt-6">
            Create Distributor Account
          </h1>
          <p className="text-cement-600 mt-2">
            Join our network of cement distributors
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  leftIcon={<User className="w-5 h-5" />}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  leftIcon={<User className="w-5 h-5" />}
                  required
                />
              </div>

              <Input
                type="email"
                label="Business Email"
                placeholder="contact@company.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                leftIcon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                type="tel"
                label="Phone Number"
                placeholder="+2348012345678"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                leftIcon={<Phone className="w-5 h-5" />}
                required
              />

              <Input
                label="Company Name"
                placeholder="Doe Cement Distributors"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                leftIcon={<Building2 className="w-5 h-5" />}
                required
              />

              <Input
                label="Business Address"
                placeholder="123 Lagos Road, Victoria Island"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                leftIcon={<MapPin className="w-5 h-5" />}
                required
              />

              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="City"
                  placeholder="Lagos"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-cement-700">
                    State
                  </label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleChange("state", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    leftIcon={<Lock className="w-5 h-5" />}
                    required
                  />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  leftIcon={<Lock className="w-5 h-5" />}
                  required
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-cement-300 text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-sm text-cement-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-brand-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-brand-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-cement-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-brand-primary font-medium hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
