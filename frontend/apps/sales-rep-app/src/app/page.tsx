"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, User, Lock, Wifi, WifiOff } from "lucide-react";
import { useAuthStore } from "@/stores/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, setOnline } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check online status
  if (typeof navigator !== "undefined") {
    setOnline(navigator.onLine);
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (email === "demo@residentcement.com" && password === "password") {
        login({
          id: "rep_001",
          name: "John Doe",
          email: email,
          territory: "Lagos Zone 1",
          token: "demo_token",
        });
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Try demo@residentcement.com / password");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary to-brand-secondary flex flex-col">
      {/* Header */}
      <div className="p-6 text-white">
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
            <Building2 className="w-10 h-10" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center">ResidentCement</h1>
        <p className="text-center text-white/80">Sales Rep Portal</p>
      </div>

      {/* Login Form */}
      <div className="flex-1 bg-white rounded-t-3xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign In</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                placeholder="demo@residentcement.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                placeholder="password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-brand-primary text-white rounded-lg font-medium disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Wifi className="w-4 h-4" />
            <span>Works offline - data syncs when connected</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Demo: demo@residentcement.com / password
        </p>
      </div>
    </div>
  );
}
